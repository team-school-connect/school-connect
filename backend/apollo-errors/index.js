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

exports.NotFoundError = NotFoundError;
exports.ConflictError = ConflictError;
