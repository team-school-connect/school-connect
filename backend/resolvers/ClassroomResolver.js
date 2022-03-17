const { UserInputError, ApolloError, ForbiddenError } = require('apollo-server-core');
const { ConflictError } = require('../apollo-errors');
const Classroom = require('../models/Classroom');
const Announcement = require('../models/Announcement');
const ClassroomUser = require('../models/ClassroomUser');
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated, isAccountType } = require('./AccountCheck');
const ShortUniqueId = require('short-unique-id');

const ClassroomResolver = {
    mutation: {
        createClassroom: combineResolvers(isAuthenticated, isAccountType(["TEACHER", "SCHOOL_ADMIN"]), 
            async (parent, args, context) => {
                const user = context.session.user;
                const { name } = args;

                const classroom = await Classroom.findOne({name, schoolId: user.schoolId});
                if (classroom) throw new ConflictError(`classroom ${name} already exists`);

                const uid = new ShortUniqueId({length: 10});
                const code = uid();
                const resClass = await Classroom.create({name, schoolId: user.schoolId, code});
                if (!resClass) throw new ApolloError('internal server error');

                const joinRes = await ClassroomUser.create({userEmail: user.email, classCode: resClass.code});
                if (!joinRes) throw new ApolloError('internal server error');

                resClass.id = resClass._id;
                console.log(resClass);
                return resClass;
        }),
        createAnnouncement: combineResolvers(isAuthenticated, isAccountType(["TEACHER", "SCHOOL_ADMIN"]), 
            async (parent, args, context) => {
                const user = context.session.user;
                
                const { title, content, className } = args;

                const classroom = await Classroom.findOne({name: className});
                if (!classroom) throw new ConflictError(`classroom ${classId} does not exist`);

                const joinClass = await ClassroomUser.findOne({userEmail: user.email, classCode: classroom.code});
                if (!joinClass) throw new ForbiddenError('user has not joined this class');
                
                let announce = await Announcement.create({title, content, className, author: user.email});
                if (!announce) throw new ApolloError('internal server error');
                announce.date = announce.createdAt;
                return announce;
        }),
        joinClassroom: combineResolvers(isAuthenticated, async (parent, args, context) => {
            const user = context.session.user;

            const { classCode } = args;

            const classroom = await Classroom.findOne({code: classCode});
            if (!classroom) throw new ConflictError(`classroom ${classCode} does not exist`);

            const currentJoinClass = await ClassroomUser.findOne({classCode, userEmail: user.email});
            if (currentJoinClass) throw new ConflictError(`user ${user.email} has already join class ${classCode}`);
            
            const joinClass = await ClassroomUser.create({userEmail: user.email, classCode});
            if (!joinClass) throw new ApolloError('internal server error');
            return {code: 200, success: true, message: `user ${user.email} has joined class ${classCode}`};
        })
    },
    query: {
        getClassrooms: combineResolvers(isAuthenticated, async (parent, args, context) => {
            const { page, schoolName } = args;
            if (page < 0) throw new UserInputError('page cannot be negative');
            const classList = await Classroom.find({schoolId: schoolName}).sort({name: 'asc'}).skip(page * 10).limit(10);
            if (!classList) throw new ApolloError('internal server error');
            return {total: classList.length, classrooms: classList};
        }),
        getAnnouncements: combineResolvers(isAuthenticated, async (parent, args, context) => {
            const { page, className } = args;
            if (page < 0) throw new UserInputError('page cannot be negative');

            const classroom = await Classroom.findOne({name: className});
            if (!classroom) throw new ConflictError(`classroom ${classCode} does not exist`);

            const currentJoinClass = await ClassroomUser.findOne({classCode, userEmail: user.email});
            if (currentJoinClass) throw new ConflictError(`user ${user.email} has already join class ${classCode}`);

            const announceList = await Announcement.find({name: className}).sort({createdAt: 'desc'}).skip(page * 10).limit(10);
            if (!announceList) throw new ApolloError('internal server error');
            announceList.forEach(x => x.date = x.createdAt)
            return {total: announceList.length, announcements: announceList};
        })
    }
}

module.exports = ClassroomResolver;