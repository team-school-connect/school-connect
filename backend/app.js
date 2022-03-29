const { ApolloServer, gql } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  UserInputError,
  ForbiddenError,
  ApolloError,
} = require("apollo-server-core");
const express = require("express");
require("dotenv").config();
const session = require("express-session")({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
});
const sharedsession = require("express-socket.io-session");
const http = require("http");
const db = require("./db");
const bcrypt = require("bcrypt");
const { combineResolvers } = require("graphql-resolvers");
const app = express();
const httpServer = http.createServer(app);
const socketHandler = require("./socket");
const validator = require("validator");
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const ShortUniqueId = require("short-unique-id");
const { finished } = require('stream/promises');

//models
const Classroom = require("./models/Classroom");
const User = require("./models/User");
const School = require("./models/School");
// const VolunteerPosition = require("./models/VolunteerPosition");

// Resolvers
const createStudyRoomMutation = require("./socket/mutations/CreateStudyRoomMutation");
const ClassroomResolver = require("./resolvers/ClassroomResolver");
const { isAuthenticated, isAccountType } = require("./resolvers/AccountCheck");
const VolunteerPositionResolver = require("./resolvers/VolunteerPositionResolver");

const { NotFoundError, ConflictError } = require("./apollo-errors");

//Temporary for socket io
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:3000", "https://studio.apollographql.com"],
  credentials: true,
};
const getStudyRoomsQuery = require("./socket/queries/getStudyRoomsQuery");
const res = require("express/lib/response");
const io = require("socket.io")(httpServer, {
  cors: corsOptions,
});
app.use(cors(corsOptions));

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

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

  type VolunteerPosition {
    id: ID
    organizationName: String
    positionName: String
    positionDescription: String
    location: String
    startDate: String
    endDate: String
  }


  type Classroom {
    id: ID
    name: String
    teacher: User
    schoolId: ID
    code: String
  }

  type ClassroomPage {
    total: Int
    classrooms: [Classroom]
  }

  type ClassroomUsers {
    userEmail: String
    classId: String
    className: String
  }

  type Announcement {
    id: ID
    title: String
    content: String
    class: Classroom
    date: String
  }

  type Assignment {
    id: ID
    name: String
    description: String
    classId: ID
    dueDate: String
    date: String
  }

  type AnnouncementPage {
    total: Int
    announcements: [Announcement]
  }

  type AssignmentPage {
    total: Int
    assignments: [Assignment]
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
    getMyClassrooms(page: Int): ClassroomPage
    getAnnouncements(page: Int, classId: String): AnnouncementPage
    getSchools: [School]
    getClassroom(classId: String): Classroom
    getAssignments(classId: String, page: Int): AssignmentPage
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
    createAnnouncement(title: String, content: String, classId: String): Announcement
    joinClassroom(classCode: String): MutationResponse

    createStudyRoom(roomName: String, subject: String): MutationResponse

    createAssignment(name: String, description: String, classId: String, dueDate: String): Assignment

    createVolunteerPosition(organizationName: String, positionName: String, positionDescription: String, location: String, startDate: String, endDate: String): MutationResponse

    submitAssignment(assignmentId: String, file: Upload!): Boolean
    testUpload(file: Upload!): Boolean
  }
`;

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
    checkTeacherOnly: combineResolvers(isAccountType(["TEACHER"]), (parent, args, context) => {
      return "you are a teacher";
    }),
    getAccountType: (parent, args, context) => {
      return { type: context.session.user.type };
    },
    getUsersSchool: (parent, args, context) => {
      return { schoolId: context.session.user.schoolId };
    },
    checkLogin: (parent, args, context) => {
      console.log(context.session);
      if (context.session.user) return `user logged in ${context.session.user.email}`;
      return "user not logged in";
    },

    getStudyRooms: getStudyRoomsQuery,

    ...ClassroomResolver.query,

    getSchools: async (parent, args, context) => {
      const schools = await School.find({}).sort({ name: "asc" });
      return schools;
    },
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
      if (user && user.type !== "SCHOOL_ADMIN") {
        context.session.user = resUser;
      }
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
    ...VolunteerPositionResolver.mutation,
    testUpload: async (parent, { file }, context) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const uid = new ShortUniqueId({ length: 10 });
      const out = require('fs').createWriteStream(`./uploads/${uid()}`);
      stream.pipe(out);
      await finished(out);
      
      return true;
    }
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => req,
  });

  app.use(session);

  app.use(graphqlUploadExpress());

  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
    cors: corsOptions,
  });

  await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

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
