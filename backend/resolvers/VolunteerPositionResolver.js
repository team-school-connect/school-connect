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
                console.log(resVolunteerPosition);

                return resVolunteerPosition;
            }
        ),
    },
};

module.exports = VolunteerPositionResolver;