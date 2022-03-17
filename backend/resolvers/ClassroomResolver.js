const { UserInputError, ApolloError } = require('apollo-server-core');
const { ConflictError } = require('../apollo-errors');
const Classroom = require('../models/Classroom');
const Announcement = require('../models/Announcement');
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated, isAccountType } = require('./AccountCheck');

const ClassroomResolver = {
    mutation: {
        createClassroom: combineResolvers(isAuthenticated, isAccountType(["TEACHER", "SCHOOL_ADMIN"]), 
            async (parent, args, context) => {
                const user = context.session.user;
                const { name } = args;

                const classroom = await Classroom.findOne({name, schoolId: user.schoolId});
                if (classroom) throw new ConflictError(`classroom ${name} already exists`);

                const resClass = await Classroom.create({name, schoolId: user.schoolId});
                if (!resClass) throw new ApolloError('internal server error');
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
                
                let announce = await Announcement.create({title, content, className, author: user.email});
                if (!announce) throw new ApolloError('internal server error');

                return announce;
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
            const announceList = await Announcement.find({name: className}).sort({createdAt: 'desc'}).skip(page * 10).limit(10);
            if (!announceList) throw new ApolloError('internal server error');
            announceList.forEach(x => x.date = x.createdAt)
            return {total: announceList.length, announcements: announceList};
        })
    }
}

module.exports = ClassroomResolver;