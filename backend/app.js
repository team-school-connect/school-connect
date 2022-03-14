const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const session = require("express-session");
const http = require("http");
const User = require("./models/User");
const School = require("./models/School");
const db = require("./db");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { skip, combineResolvers } = require("graphql-resolvers");
const app = express();
const httpServer = http.createServer(app);
const socketHandler = require("./socket");

//Temporary for socket io
const cors = require("cors");
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});
app.use(cors());

const typeDefs = gql`
  type MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  enum AccountType {
    STUDENT
    SCHOOL_ADMIN
    TEACHER
  }

  type School {
    name: String
    id: ID
  }

  type User {
    firstName: String
    lastName: String
    email: String
    password: String
    schoolId: ID
    type: AccountType
  }

  type Query {
    checkLogin: String
    checkTeacherOnly: String
  }

  type Mutation {
    # create new user and school in db
    signupSchool(
      firstName: String
      lastName: String
      email: String
      password: String
      schoolName: String
    ): MutationResponse

    # for students and teachers
    signup(
      firstName: String
      lastName: String
      email: String
      password: String
      schoolId: String
      type: AccountType
    ): MutationResponse
    signin(email: String, password: String): MutationResponse

    signout: MutationResponse
  }
`;

const isTeacher = (parent, args, context) => {
  return !context.session.user || context.session.user.type !== "TEACHER" ? "not a teacher" : skip;
};

const resolvers = {
  Query: {
    checkTeacherOnly: combineResolvers(isTeacher, (parent, args, context) => {
      return "you are a teacher";
    }),
    checkLogin: (parent, args, context) => {
      console.log(context.session);
      if (context.session.user) return `user logged in ${context.session.user.email}`;
      return "user not logged in";
    },
  },
  Mutation: {
    signupSchool: async (parent, args, context) => {
      const { firstName, lastName, email, password, schoolName } = args;
      const user = await User.findOne({ email });
      if (user) return { code: 400, success: false, message: "user already exists" };
      const school = await School.findOne({name: schoolName});
      if (school) return { code: 400, success: false, message: "school already exists" };
      const hash = await bcrypt.hash(password, 10);
      if (!hash) return { code: 500, success: false, message: "internal server error" };
      const resUser = await User.create({ firstName, lastName, email, hash, type: "SCHOOL_ADMIN" });
      if (!resUser) return { code: 500, success: false, message: "internal server error" };
      const resSchool = await School.create({ name: schoolName });
      if (!resSchool) return { code: 500, success: false, message: "internal server error" };
      context.session.user = resUser;
      return { code: 200, success: true, message: "user and school created" };
    },
    signup: async (parent, args, context) => {
      const { firstName, lastName, email, password, type, schoolId } = args;
      let user = context.session.user;

      if (((user && user.type !== "SCHOOL_ADMIN") || !user) && args.type === "TEACHER")
        return { code: 401, success: false, message: "cannot create teacher account" };

      if (type === "SCHOOL_ADMIN")
        return { code: 400, success: false, message: "cannot create school admin" };
      const school = await School.findOne({ name: schoolId });
      if (!school) return { code: 400, success: false, message: "school does not exist" };
      const findUser = await User.findOne({ email });
      if (findUser) return { code: 400, success: false, message: "user already exists" };
      const hash = await bcrypt.hash(password, 10);
      if (!hash) return { code: 500, success: false, message: "internal server error" };
      const resUser = await User.create({ firstName, lastName, email, hash, type, schoolId });
      if (!resUser) return { code: 500, success: false, message: "internal server error" };
      context.session.user = resUser;
      return { code: 200, success: true, message: "user created" };
    },
    signin: async (parent, args, context) => {
      const { email, password } = args;
      const user = await User.findOne({ email });
      if (!user) return { code: 401, success: false, message: "access denied" };
      const resPassword = await bcrypt.compare(password, user.hash);
      if (!resPassword) return { code: 401, success: false, message: "access denied" };
      context.session.user = user;
      return { code: 200, success: true, message: "user logged in" };
    },
    signout: (parent, args, context) => {
      context.session.destroy();
      return { code: 200, success: true, message: "user logged out" };
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => req,
  });

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

dotenv.config();
db.connect();

startApolloServer(typeDefs, resolvers);

io.on("connection", socketHandler.connect(io));
