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
  cookie: { secure: true, sameSite: true }
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
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const ShortUniqueId = require("short-unique-id");
const { finished } = require("stream/promises");
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
const { isAuthenticated, isAccountType } = require("./resolvers/AccountCheck");
const VolunteerPositionResolver = require("./resolvers/VolunteerPositionResolver");

const { NotFoundError, ConflictError, UnverifiedError } = require("./apollo-errors");

//Temporary for socket io
const cors = require("cors");
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};
const getStudyRoomsQuery = require("./socket/queries/getStudyRoomsQuery");
const res = require("express/lib/response");
const Submission = require("./models/Submission");
const ClassroomUser = require("./models/ClassroomUser");
const VerificationCode = require("./models/VerificationCode");
const { sendVerificationCode, onVerificationCodeSentError } = require("./verification");
const { sentryPlugin } = require("./sentry-plugin");
const { sendPasswordReset, onPasswordResetSentError } = require("./resetPassword");
const ResetPassword = require("./models/ResetPassword");
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
    submitted: String
  }

  type Submission {
    id: ID
    assignmentId: ID
    userId: ID
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

  type SubmissionPage {
    total: Int
    submissions: [Submission]
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

  type VolunteerPosition {
    id: ID
    organizationName: String
    positionName: String
    positionDescription: String
    location: String
    startDate: String
    endDate: String
  }

  type VolunteerPositionPage {
    total: Int
    VolunteerPositions: [VolunteerPosition]
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
    getAssignment(assignmentId: String): Assignment
    getAssignments(classId: String, page: Int): AssignmentPage
    getStudentSubmissions(classId: String, assignmentId: String, page: Int): SubmissionPage
    getVolunteerPositions(page: Int): VolunteerPositionPage
    getSingleVolunteerPosition(_id: ID): VolunteerPosition
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

    verifyAccount(code: String): MutationResponse

    requestResetPassword(email: String): MutationResponse
    resetPassword(email: String, tempPassword: String, newPassword: String): MutationResponse

    createClassroom(name: String): Classroom
    createAnnouncement(title: String, content: String, classId: String): Announcement
    joinClassroom(classCode: String): MutationResponse

    createStudyRoom(roomName: String, subject: String): MutationResponse

    createAssignment(
      name: String
      description: String
      classId: String
      dueDate: String
    ): Assignment

    createVolunteerPosition(
      organizationName: String
      positionName: String
      positionDescription: String
      location: String
      startDate: String
      endDate: String
    ): MutationResponse

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

    getStudyRooms: combineResolvers(isAuthenticated, getStudyRoomsQuery),

    ...ClassroomResolver.query,
    ...VolunteerPositionResolver.query,

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

      try {
        await sendVerificationCode(resUser._id, email);
      } catch (err) {
        console.log(err);
        onVerificationCodeSentError(resUser._id, schoolName);
        throw new ApolloError("internal server error");
      }

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
      // if (user && user.type !== "SCHOOL_ADMIN") {
      //   context.session.user = resUser;
      // }
      //Create the verification code
      try {
        await sendVerificationCode(resUser._id, email);
      } catch (err) {
        console.log(err);
        onVerificationCodeSentError(resUser._id);
        throw new ApolloError("internal server error");
      }

      return { code: 200, success: true, message: "user created" };
    },

    verifyAccount: async (parent, args, context) => {
      const { code: inputCode } = args;

      //Check if code exists
      const verifyRes = await VerificationCode.findOne({ code: inputCode });

      if (verifyRes === null) throw new NotFoundError("The verification link does not exist.");

      //Activate the userisVerified

      const user = await User.findByIdAndUpdate(verifyRes.userId, {
        isVerified: true,
      }).exec();

      //Delete code from database
      VerificationCode.deleteOne({ code: inputCode }).exec();

      return { code: 200, success: true, message: "user verified" };
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

      if (!user.isVerified)
        throw new UnverifiedError(
          "Your account is not verified! Check your email for a verification link."
        );
      return { code: 200, success: true, message: "user logged in" };
    },
    signout: (parent, args, context) => {
      context.session.destroy();
      return { code: 200, success: true, message: "user logged out" };
    },
    requestResetPassword: async (parent, args, content) => {
      const { email } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);

      const user = await User.findOne({ email });

      if (user == null) {
        return { code: 200, success: true, message: "email sent if valid" };
      }

      try {
        await sendPasswordReset(user._id, email);
        return { code: 200, success: true, message: "email sent if valid" };
      } catch (err) {
        console.log(err);
        onPasswordResetSentError(user._id);
        throw new ApolloError("Something went wrong. Try again later.");
      }
    },
    resetPassword: async (parent, args, content) => {
      const { email, tempPassword, newPassword } = args;

      if (!newPassword) throw new UserInputError("New password is not valid.");

      const user = await User.findOne({ email });

      if (user == null) throw new NotFoundError("User with the email provided doesn't exist");

      const passwordEntry = await ResetPassword.findOne({ userId: user._id });

      if (passwordEntry == null)
        throw new NotFoundError(
          "Reset password expired or does not exist. Please request for a new password reset."
        );

      const isValid = await bcrypt.compare(tempPassword, passwordEntry.hash);
      if (!isValid) {
        throw new ForbiddenError("access denied");
      }

      //change the password
      try {
        const newHash = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { hash: newHash });
        ResetPassword.deleteMany({ userId: user._id }).exec();
        return { code: 200, success: true, message: "email sent if valid" };
      } catch (err) {
        console.log(err);
        throw new ApolloError("internal server error");
      }
    },
    createStudyRoom: combineResolvers(isAuthenticated, createStudyRoomMutation),
    ...ClassroomResolver.mutation,
    ...VolunteerPositionResolver.mutation,
    testUpload: async (parent, { file }, context) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const uid = new ShortUniqueId({ length: 10 });
      const out = require("fs").createWriteStream(`./uploads/${uid()}`);
      stream.pipe(out);
      await finished(out);

      return true;
    },
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
