const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const User = require('./models/User');
const db = require("./db");
const dotenv = require("dotenv");

const typeDefs = gql`
  type MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  enum AccountType {
      STUDENT
  }

  type User {
    firstName: String
    lastName: String
    email: String
    password: String
    type: AccountType
  }

  type Query {
      getAllUsers: [User]
  }

  type Mutation {
      signup(firstName: String, lastName: String, email: String, password: String): MutationResponse
  }
`;

const resolvers = {
    Query: {
        getAllUsers: () => users,
    },
    Mutation: {
        signup: (parent, args) => {
            const { firstName, lastName, email, password } = args;
            return User.findOne({email})
            .then(item => {
                if (!item) return User.create({firstName, lastName, email, password});
            })
            .then(item => {
                console.log(item);
                if (!item) return {code: 400, success: false, message: 'user already exists'};
                return {code: 200, success: true, message: 'user created'};
            })
            .catch(err => ({code: 500, success: false, message: err}));
        }
    }
  };

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);
  
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  
    await server.start();
    server.applyMiddleware({
      app,
      path: '/',
    });
  
    // Modified server startup
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  }

dotenv.config();
db.connect()
startApolloServer(typeDefs, resolvers);
