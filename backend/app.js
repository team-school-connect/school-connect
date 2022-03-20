const { ApolloServer, gql } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  UserInputError,
  ForbiddenError,
  ApolloError,
} = require("apollo-server-core");
const express = require("express");
const session = require("express-session");
const http = require("http");
const User = require("./models/User");
const School = require("./models/School");
const db = require("./db");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { combineResolvers } = require("graphql-resolvers");
const app = express();
const httpServer = http.createServer(app);
const socketHandler = require("./socket");
const validator = require("validator");

// Resolvers
const createStudyRoomMutation = require("./socket/mutations/CreateStudyRoomMutation");
const ClassroomResolver = require("./resolvers/ClassroomResolver");
const { isAuthenticated, isAccountType } = require("./resolvers/AccountCheck");

const { NotFoundError, ConflictError } = require("./apollo-errors");

//Temporary for socket io
const cors = require("cors");
const corsOptions = { origin: "http://localhost:3000", credentials: true };
const getStudyRoomsQuery = require("./socket/queries/getStudyRoomsQuery");
const io = require("socket.io")(httpServer, {
  cors: corsOptions,
});
app.use(cors(corsOptions));

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

  type StudyRoom {
    _id: ID
    roomName: String
    ownerId: String
    participantCount: Int
    subject: String
    createdOn: String
  }

  type StudyRoomPage {
    totalRows: Int
    studyRooms: [StudyRoom]
  }

  type Classroom {
    id: ID
    name: String
    schoolId: ID
    code: String
  }

  type ClassroomPage {
    total: Int
    classrooms: [Classroom]
  }

  type ClassroomUsers {
    userEmail: String
    classCode: String
  }

  type Announcement {
    title: String
    content: String
    author: String
    className: String
    date: String
  }

  type AnnouncementPage {
    total: Int
    announcements: [Announcement]
  }

  type AccountTypeResponse {
    type: AccountType
  }
  type UsersSchool {
    schoolId: String
  }

  type SchoolList {
    Schools: [School]
  }

  type Query {
    checkLogin: String
    checkTeacherOnly: String
    getAccountType: AccountTypeResponse
    getUsersSchool: UsersSchool
    getStudyRooms(page: Int): StudyRoomPage
    getClassrooms(page: Int, schoolName: String): ClassroomPage
    getAnnouncements(page: Int, className: String): AnnouncementPage
    getSchools: [School]
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
      type: String
    ): MutationResponse
    signin(email: String, password: String): MutationResponse

    signout: MutationResponse

    createClassroom(name: String): Classroom
    createAnnouncement(title: String, content: String, className: String): Announcement
    joinClassroom(classCode: String): MutationResponse

    createStudyRoom(roomName: String, subject: String): MutationResponse
  }
`;

const resolvers = {
  Query: {
    checkTeacherOnly: combineResolvers(isAccountType(["TEACHER"]), (parent, args, context) => {
      return "you are a teacher";
    }),
    getAccountType: (parent, args, context) => {
      return {type: context.session.user.type};
    },
    getUsersSchool: (parent, args, context) => {
      return {schoolId: context.session.user.schoolId};
    },
    checkLogin: (parent, args, context) => {
      console.log(context.session);
      if (context.session.user) return `user logged in ${context.session.user.email}`;
      return "user not logged in";
    },

    getStudyRooms: getStudyRoomsQuery,

    ...ClassroomResolver.query,

    getSchools: async (parent, args, context) => {
      const schools = await School.find({}).sort({name: 'asc'});
      return schools;
    }
  },
  Mutation: {
    signupSchool: async (parent, args, context) => {
      const { firstName, lastName, email, password, schoolName } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);
      const user = await User.findOne({ email });
      if (user) throw new ConflictError("user already exists");
      const school = await School.findOne({ name: schoolName });
      if (school) throw new ConflictError("school already exists");
      const hash = await bcrypt.hash(password, 10);
      if (!hash) throw new ApolloError("Something went wrong");
      const resUser = await User.create({
        firstName,
        lastName,
        email,
        hash,
        type: "SCHOOL_ADMIN",
        schoolId: schoolName,
      });
      if (!resUser) throw new ApolloError("Something went wrong");
      const resSchool = await School.create({ name: schoolName });
      if (!resSchool) throw new ApolloError("Something went wrong");
      context.session.user = resUser;
      return { code: 200, success: true, message: "user and school created" };
    },
    signup: async (parent, args, context) => {
      const { firstName, lastName, email, password, type, schoolId } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);
      let user = context.session.user;
      console.log(user);

      if (((user && user.type !== "SCHOOL_ADMIN") || !user) && args.type === "TEACHER") {
        throw new ForbiddenError("cannot create teacher account");
      }

      if (type === "SCHOOL_ADMIN") throw new UserInputError("cannot create school admin");
      const school = await School.findOne({ name: schoolId });
      if (!school) throw new NotFoundError("school does not exist");
      const findUser = await User.findOne({ email });
      if (findUser) throw new ConflictError("user already exists");
      const hash = await bcrypt.hash(password, 10);
      if (!hash) throw new ApolloError("internal server error");
      const resUser = await User.create({ firstName, lastName, email, hash, type, schoolId });
      if (!resUser) throw new ApolloError("internal server error");
      context.session.user = resUser;
      return { code: 200, success: true, message: "user created" };
    },
    signin: async (parent, args, context) => {
      const { email, password } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);
      const user = await User.findOne({ email });
      if (!user) throw new ForbiddenError("access denied");
      const resPassword = await bcrypt.compare(password, user.hash);
      if (!resPassword) throw new ForbiddenError("access denied");
      context.session.user = user;
      console.log(context.session.user);
      console.log("LOGGEDIN");
      return { code: 200, success: true, message: "user logged in" };
    },
    signout: (parent, args, context) => {
      context.session.destroy();
      return { code: 200, success: true, message: "user logged out" };
    },
    createStudyRoom: combineResolvers(isAuthenticated, createStudyRoomMutation),
    ...ClassroomResolver.mutation,
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
    cors: corsOptions,
  });

  await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

dotenv.config();
db.connect();

startApolloServer(typeDefs, resolvers);

io.on("connection", socketHandler.connect(io));
