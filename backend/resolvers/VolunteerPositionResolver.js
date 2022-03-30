const { UserInputError, ApolloError, ForbiddenError } = require("apollo-server-core");
const { ConflictError } = require("../apollo-errors");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated, isAccountType } = require("./AccountCheck");
const VolunteerPosition = require("../models/VolunteerPosition");

const VolunteerPositionResolver = {
    mutation: {
        createVolunteerPosition: combineResolvers(
            isAuthenticated,
            isAccountType(["TEACHER", "SCHOOL_ADMIN"]),
            async (parent, args, context) => {
                const user = context.session.user;
                const { organizationName, positionName, positionDescription, location, startDate, endDate } = args;

                const volunteerPosition = await VolunteerPosition.findOne({ organizationName, positionName, schoolId: user.schoolId, location, startDate, endDate });
                if (volunteerPosition) throw new ConflictError(`Volunteer position "${positionName}" at ${location} for organization ${organizationName} already exists`);

                const resVolunteerPosition = await VolunteerPosition.create({
                    posterId: user._id,
                    organizationName,
                    positionName,
                    positionDescription,
                    schoolId: user.schoolId,
                    location,
                    startDate,
                    endDate,
                });
                if (!resVolunteerPosition) throw new ApolloError("internal server error");

                resVolunteerPosition.id = resVolunteerPosition._id;
                

                return { code: 200, success: true, message: "Volunteer Position Created" };
            }
        ),
    },

    query: {
        getVolunteerPositions: combineResolvers(
            isAuthenticated,
            isAccountType(["STUDENT", "TEACHER", "SCHOOL_ADMIN"]),
            async (parent, args, context) => {
                const user = context.session.user;
                //Paginate 10 results per page
                const { page } = args;
                if (page < 0) throw new UserInputError("page cannot be negative");


                const volunteerPositions = await VolunteerPosition.find({schoolId: user.schoolId})
                    .skip(page * 10)
                    .limit(10)
                    .sort({ startDate: -1 })
                    .exec();
                
                if (!volunteerPositions) throw new ApolloError("internal server error");

                //get the total number of volunteer positions
                const total = await VolunteerPosition.countDocuments({schoolId: user.schoolId});

                return { total, VolunteerPositions: volunteerPositions };
            }
        ),
    },
};

module.exports = VolunteerPositionResolver;