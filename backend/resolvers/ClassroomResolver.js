const { UserInputError, ApolloError, ForbiddenError } = require("apollo-server-core");
const { ConflictError, NotFoundError } = require("../apollo-errors");
const Classroom = require("../models/Classroom");
const Announcement = require("../models/Announcement");
const Assignment = require("../models/Assignment");
const ClassroomUser = require("../models/ClassroomUser");
const Submission = require("../models/Submission");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated, isAccountType } = require("./AccountCheck");
const ShortUniqueId = require("short-unique-id");
const validator = require("validator");
const fs = require('fs');
const { finished } = require('stream/promises');

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

        const joinClass = await ClassroomUser.create({
          classId: resClass._id,
          className: resClass.name,
          userEmail: user.email,
        });

        if (!joinClass) throw new ApolloError("internal server error");

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

        if (classroom.teacherId.toString() !== user._id.toString())
          throw new ForbiddenError("user is not the teacher of this class");

        let announce = await Announcement.create({
          title: sanitizeTitle,
          content: sanitizeContent,
          classId,
        });
        announce.date = announce.createdAt;
        announce.id = announce._id;
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
    createAssignment: combineResolvers(
      isAuthenticated,
      isAccountType(["TEACHER"]),
      async(parent, args, context) => {
      const user = context.session.user;
      const { name, description, classId, dueDate } = args;

      if (!validator.isISO8601(dueDate)) throw new UserInputError('invalid date');
      if (validator.isBefore(dueDate)) throw new UserInputError('date is before now');
      
      const classroom = await Classroom.findById(classId);
      if (!classroom) throw new ConflictError('classroom does not exist');
      
      const inClass = await ClassroomUser.findOne({userEmail: user.email, classId});
      if (!inClass) throw new ConflictError('user is not in classroom');

      const assignment = await Assignment.create({name, description, classId, dueDate});
      if (!assignment) throw new ApolloError('internal server error');
      assignment.date = assignment.createdAt;
      return assignment;
    }),
    submitAssignment: combineResolvers(
      isAuthenticated,
      isAccountType(["STUDENT"]),
      async (parent, args, context) => {
        const user = context.session.user;
        const assignmentId = args.assignmentId;
        const file = args.file;
        const { createReadStream, filename, mimetype, encoding } = await file;

        // check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) throw new ConflictError('assignment does not exist');

        const inClass = await ClassroomUser.findOne({userEmail: user.email, classId: assignment.classId});
        if (!inClass) throw new ConflictError('user is not in classroom');

        if (!validator.isAfter(assignment.dueDate.toString())) throw new ConflictError('due date has passed');

        const sub = await Submission.findOne({userId: user.email, assignmentId});
        if (sub) await Submission.deleteOne(sub);

        const stream = createReadStream();
        const uid = new ShortUniqueId({ length: 10 });
        const id = uid();
        console.log(id);
        const out = fs.createWriteStream(`./uploads/${id}`);
        stream.pipe(out);
        await finished(out);
        const submission = await Submission.create({userId: user.email, filename, mimetype, encoding, assignmentId, classId: assignment.classId, path: `./uploads/${id}`});
        if (!submission) throw new ConflictError('internal server error');

        return true;
      }
    )
  },
  query: {
    getClassroom: combineResolvers(isAuthenticated, async (parent, args, context) => {
      const { classId } = args;

      const classInfo = await Classroom.findOne({ _id: classId });

      return classInfo;
    }),
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
      const { page, classId } = args;
      const user = context.session.user;

      if (page < 0) throw new UserInputError("page cannot be negative");

      const classroom = await Classroom.findOne({ _id: classId });
      if (!classroom) throw new ConflictError(`classroom ${classId} does not exist`);

      if (user.type === "STUDENT") {
        const currentJoinClass = await ClassroomUser.findOne({ classId, userEmail: user.email });
        if (!currentJoinClass)
          throw new ForbiddenError(`user ${user.email} is not in the class ${classId}`);
      } else {
        if (classroom.teacherId.toString() !== user._id.toString()) {
          throw new ForbiddenError(`user ${user.email} is not the teacher of the class ${classId}`);
        }
      }

      const announceList = await Announcement.find({ classId })
        .sort({ createdAt: "desc" })
        .skip(page * 10)
        .limit(10)
        .exec();

      const total = await Announcement.countDocuments({ classId });

      announceList.forEach((x) => {
        x.date = x.createdAt;
        x.id = x._id;
      });
      return { total, announcements: announceList };
    }),
    getAssignments: combineResolvers(
      isAuthenticated,
      async (parent, args, context) => {
        const { page, classId } = args;
        if (page < 0) throw new UserInputError('page cannot be negative');
        const user = context.session.user;
        const isClass = await ClassroomUser.findOne({userEmail: user.email, classId});
        if (!isClass) throw new ConflictError('user is not part of classroom');

        const total = await Assignment.countDocuments({ classId });

        const assignments = await Assignment.find({classId})
          .sort({ createdAt: "desc" })
          .skip(page * 10)
          .limit(10)
          .exec();

        assignments.forEach((x) => {
          x.date = x.createdAt;
          x.id = x._id;
        });

        return {total, assignments};
    }),
    getAssignment: combineResolvers(
      isAuthenticated,
      async (parent, args, context) => {
        const { assignmentId } = args;
        const user = context.session.user;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) throw new NotFoundError('assignment not found');

        const inClass = await ClassroomUser.findOne({userEmail: user.email, classId: assignment.classId});
        if (!inClass) throw new ForbiddenError('user not in classroom');

        assignment.date = assignment.createdAt;
        return assignment;
    }),
    getStudentSubmissions: combineResolvers(
      isAuthenticated,
      isAccountType(["TEACHER"]),
      async (parent, args, context) => {
        const { classId, assignmentId, page } = args;
        const user = context.session.user;

        const isClass = await ClassroomUser.findOne({userEmail: user.email, classId});
        if (!isClass) throw new ConflictError('user is not part of classroom');

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) throw new ConflictError('assignment does not exist');

        const total = await Announcement.countDocuments({ classId });

        const submissions = await Submission.find({assignmentId})
          .sort({ createdAt: "desc" })
          .skip(page * 10)
          .limit(10)
          .exec();
        submissions.forEach((x) => {
          x.date = x.createdAt;
          x.id = x._id;
        });
        return {total, submissions};
    })
  },
};

module.exports = ClassroomResolver;
