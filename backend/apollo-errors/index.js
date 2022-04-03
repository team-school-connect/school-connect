const { ApolloError } = require("apollo-server-errors");

class NotFoundError extends ApolloError {
  constructor(message) {
    super(message, "404");

    Object.defineProperty(this, "name", { value: "NotFoundError" });
  }
}

class ConflictError extends ApolloError {
  constructor(message) {
    super(message, "409");

    Object.defineProperty(this, "name", { value: "ConflictError" });
  }
}

class UnverifiedError extends ApolloError {
  constructor(message) {
    super(message, "403");

    Object.defineProperty(this, "name", { value: "UnverifiedError" });
  }
}

exports.NotFoundError = NotFoundError;
exports.ConflictError = ConflictError;
exports.UnverifiedError = UnverifiedError;
