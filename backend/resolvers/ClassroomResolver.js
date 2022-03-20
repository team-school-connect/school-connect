const { UserInputError, ApolloError, ForbiddenError } = require("apollo-server-core");
const { ConflictError } = require("../apollo-errors");
const Classroom = require("../models/Classroom");
const Announcement = require("../models/Announcement");
const ClassroomUser = require("../models/ClassroomUser");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated, isAccountType } = require("./AccountCheck");
const ShortUniqueId = require("short-unique-id");
const validator = require("validator");

const ClassroomResolver = {
  mutation: {
    createClassroom: combineResolvers(
      isAuthenticated,
      isAccountType(["TEACHER", "SCHOOL_ADMIN"]),
      async (parent, args, context) => {
        const user = context.session.user;
        const teacherId = user._id;
        const { name } = args;

        const classroom = await Classroom.findOne({ name, schoolId: user.schoolId, teacherId });
        if (classroom) throw new ConflictError(`classroom ${name} already exists`);

        const uid = new ShortUniqueId({ length: 10 });
        const code = uid();
        const resClass = await Classroom.create({
          name,
          schoolId: user.schoolId,
          code,
          teacherId,
        });
        if (!resClass) throw new ApolloError("internal server error");

        resClass.id = resClass._id;
        console.log(resClass);
        return resClass;
      }
    ),
    createAnnouncement: combineResolvers(
      isAuthenticated,
      isAccountType(["TEACHER", "SCHOOL_ADMIN"]),
      async (parent, args, context) => {
        const user = context.session.user;

        const { title, content, classId } = args;
        const sanitizeTitle = validator.escape(title);
        const sanitizeContent = validator.escape(content);

        const classroom = await Classroom.findOne({ _id: classId });
        if (!classroom) throw new ConflictError(`classroom ${classId} does not exist`);

        if (classroom.teacherId !== user._id)
          throw new ForbiddenError("user is not the teacher of this class");

        let announce = await Announcement.create({
          title: sanitizeTitle,
          content: sanitizeContent,
          classId,
        });
        if (!announce) throw new ApolloError("internal server error");
        announce.date = announce.createdAt;
        return announce;
      }
    ),
    joinClassroom: combineResolvers(isAuthenticated, async (parent, args, context) => {
      const user = context.session.user;

      const { classCode } = args;
      if (!validator.isAlphanumeric(classCode)) throw new UserInputError("not a valid class code");

      const classroom = await Classroom.findOne({ code: classCode });
      if (!classroom) throw new ConflictError(`classroom ${classCode} does not exist`);

      const currentJoinClass = await ClassroomUser.findOne({
        classId: classroom._id,
        userEmail: user.email,
      });
      if (currentJoinClass)
        throw new ConflictError(`user ${user.email} has already join class ${classCode}`);

      const joinClass = await ClassroomUser.create({
        classId: classroom._id,
        className: classroom.name,
        userEmail: user.email,
      });
      if (!joinClass) throw new ApolloError("internal server error");
      return {
        code: 200,
        success: true,
        message: `user ${user.email} has joined class ${classCode}`,
      };
    }),
  },
  query: {
    getMyClassrooms: combineResolvers(isAuthenticated, async (parent, args, context) => {
      const user = context.session.user;
      const { page } = args;
      if (page < 0) throw new UserInputError("page cannot be negative");

      if (user.type === "STUDENT") {
        let classList = await ClassroomUser.find({ userEmail: user.email })
          .sort({ className: "asc" })
          .skip(page * 10)
          .limit(10)
          .populate("classId")
          .exec();

        const total = await ClassroomUser.countDocuments({ userEmail: user.email });

        return { total, classrooms: classList.map(({ classId }) => classId) };
      } else {
        let classList = await Classroom.find({ teacherId: user._id })
          .sort({ name: "asc" })
          .skip(page * 10)
          .limit(10)
          .exec();

        const total = await Classroom.countDocuments({ teacherId: user._id });

        return { total, classrooms: classList };
      }
    }),
    getAnnouncements: combineResolvers(isAuthenticated, async (parent, args, context) => {
      const { page, className } = args;
      if (page < 0) throw new UserInputError("page cannot be negative");

      const classroom = await Classroom.findOne({ name: className });
      if (!classroom) throw new ConflictError(`classroom ${classCode} does not exist`);

      const currentJoinClass = await ClassroomUser.findOne({ classCode, userEmail: user.email });
      if (currentJoinClass)
        throw new ConflictError(`user ${user.email} has already join class ${classCode}`);

      const announceList = await Announcement.find({ name: className })
        .sort({ createdAt: "desc" })
        .skip(page * 10)
        .limit(10);
      if (!announceList) throw new ApolloError("internal server error");
      announceList.forEach((x) => (x.date = x.createdAt));
      return { total: announceList.length, announcements: announceList };
    }),
  },
};

module.exports = ClassroomResolver;
