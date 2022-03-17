const { AuthenticationError, UserInputError, ApolloError, ForbiddenError } = require('apollo-server-core');
const Classroom = require('../models/Classroom');
const Announcement = require('../models/Announcement');

const ClassroomResolver = {
    mutation: {
        createClassroom: async (parent, args, context) => {
            if (!context.session.user) throw new AuthenticationError('user not authenticated');
            const user = context.session.user;
            if (user.type === "STUDENT") throw new ForbiddenError('invalid permissions');

            const { name } = args;

            const classroom = await Classroom.findOne({name, schoolId: user.schoolId});
            if (classroom) throw new UserInputError(`classroom ${name} already exists`);

            const resClass = await Classroom.create({name, schoolId: user.schoolId});
            if (!resClass) throw new ApolloError('internal server error');
            resClass.id = resClass._id;
            console.log(resClass);
            return resClass;
        },
        createAnnouncement: async (parent, args, context) => {
            if (!context.session.user) throw new AuthenticationError('user not authenticated');
            const user = context.session.user;
            if (user.type === "STUDENT") throw new ForbiddenError('invalid permissions');
            
            const { title, content, className } = args;

            const classroom = await Classroom.findOne({name: className});
            if (!classroom) throw new UserInputError(`classroom ${classId} does not exist`);
            
            const announce = await Announcement.create({title, content, className});
            if (!announce) throw new ApolloError('internal server error');

            announce.date = announce.createdAt;
            announce.author = user;
            return announce;
        }
    }
}

module.exports = ClassroomResolver;