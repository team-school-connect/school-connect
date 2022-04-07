const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema.js");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
require("dotenv").config();
const session = require("express-session")({
  proxy: true,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: true }
});
const sharedsession = require("express-socket.io-session");
const http = require("http");
const db = require("./db");
const { combineResolvers } = require("graphql-resolvers");
const app = express();
const httpServer = http.createServer(app);
const socketHandler = require("./socket");
const validator = require("validator");
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const fs = require("fs");

//server port
const PORT = 3000;

//models
const Classroom = require("./models/Classroom");
const User = require("./models/User");
const School = require("./models/School");
// const VolunteerPosition = require("./models/VolunteerPosition");

// Resolvers
const createStudyRoomMutation = require("./socket/mutations/CreateStudyRoomMutation");
const ClassroomResolver = require("./resolvers/ClassroomResolver");
const { isAuthenticated } = require("./resolvers/AccountCheck");
const VolunteerPositionResolver = require("./resolvers/VolunteerPositionResolver");
const UserResolver = require("./resolvers/UserResolver");

//Temporary for socket io
const cors = require("cors");
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};
const getStudyRoomsQuery = require("./socket/queries/getStudyRoomsQuery");
const Submission = require("./models/Submission");
const ClassroomUser = require("./models/ClassroomUser");
const { sentryPlugin } = require("./sentry-plugin");
const io = require("socket.io")(httpServer, {
  cors: corsOptions,
});
app.use(cors(corsOptions));

const resolvers = {
  Upload: GraphQLUpload,
  Announcement: {
    class: async (parent) => {
      const classroom = await Classroom.findOne({ _id: parent.classId });
      return classroom;
    },
  },

  Classroom: {
    teacher: async (parent) => {
      const teacher = await User.findOne({ _id: parent.teacherId });
      console.log(teacher);
      return teacher;
    },
  },

  Query: {
    getStudyRooms: combineResolvers(isAuthenticated, getStudyRoomsQuery),
    ...UserResolver.query,
    ...ClassroomResolver.query,
    ...VolunteerPositionResolver.query,

    getSchools: async (parent, args, context) => {
      const schools = await School.find({}).sort({ name: "asc" });
      return schools;
    },
  },
  Mutation: {
    ...UserResolver.mutation,
    createStudyRoom: combineResolvers(isAuthenticated, createStudyRoomMutation),
    ...ClassroomResolver.mutation,
    ...VolunteerPositionResolver.mutation,
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), sentryPlugin],
    context: ({ req }) => req,
  });

  app.use(session);

  app.use(graphqlUploadExpress({ maxFileSize: 5000000 }));

  app.get("/submission/:submitId", async (req, res, next) => {
    const user = req.session.user;
    if (!user) return res.status(401).end("user not logged in");

    if (user.type !== "TEACHER") res.status(401).end("unauthorized");

    if (!validator.isMongoId(req.params.submitId)) return res.status(400).end("invalid id");
    const submission = await Submission.findById(req.params.submitId);
    if (!submission) return res.status(404).end("submission not found");

    const inClass = await ClassroomUser.findOne({
      userEmail: user.email,
      classId: submission.classId,
    });
    if (!inClass) return res.status(401).end("user is not in classroom");

    res.download(submission.path, submission.filename, {
      headers: { "Content-Type": submission.mimetype },
    });
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
    cors: corsOptions,
  });

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

db.connect();

startApolloServer(typeDefs, resolvers);

io.use(sharedsession(session));
io.use((socket, next) => {
  console.log("SOCKET AUTH");
  if (!socket.handshake.session.user) {
    next(new Error("User is not signed in"));
  }
  next();
});

io.on("connection", socketHandler.connect(io));
