const { ApolloError } = require("apollo-server-core");
require("dotenv").config();
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

//Some of this code was sourced from https://blog.sentry.io/2020/07/22/handling-graphql-errors-using-sentry
const sentryPlugin = {
  async requestDidStart(x) {
    return {
      async didEncounterErrors(requestContext) {
        if (!requestContext.operation) return;

        
        for (const error of requestContext.errors) {
          if (error.originalError instanceof ApolloError) {
            Sentry.withScope((scope) => {
              scope.setTag("name", requestContext.operationName);
              scope.setTag("operation", requestContext.operation.operation);

              scope.setExtra("query", requestContext.request.query);
              scope.setExtra("variables", requestContext.request.variables);
              scope.setExtra("user-agent", requestContext.request.http.headers.get("user-agent"));

              Sentry.captureException(error);
            });
          }
        }
      },
    };
  },
};

exports.sentryPlugin = sentryPlugin;
