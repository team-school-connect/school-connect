const { AuthenticationError, ForbiddenError} = require('apollo-server-core');
const { skip } = require("graphql-resolvers");

const isAuthenticated = (parent, args, context) => {
    return context.session.user ? skip : new AuthenticationError("User is not logged in");
};

const isAccountType = (allowedTypes) => (parent, args, context) => {
    return allowedTypes.includes(context.session.user.type) ? skip : new ForbiddenError('Invalid User type to perform action');
}

module.exports = {isAuthenticated, isAccountType};