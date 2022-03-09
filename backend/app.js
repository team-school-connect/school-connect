const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const User = require('./models/User');

const db = require("./db");
const dotenv = require("dotenv");
const session = require('express-session');
const bcrypt = require('bcrypt');

const schema = buildSchema(`
input UserInput {
    firstName: String
    lastName: String
    email: String
    hash: String
    type: String
}

type User {
    firstName: String
    lastName: String
    email: String
    hash: String
    type: String
}

type Query {
    getStudents(id: ID!, page: Int): [User]
}

type Mutation {
    signin(email: String, password: String): String
    signup(input: UserInput): String
}
`);

let root = {
    signup: ({ input }, request) => {
        User.findOne({email: input.email}, (err, item) => {
            if (item) return;
            bcrypt.hash(input.hash, 10, (err, hash) => {
                User.create({firstName: input.firstName, lastName: input.lastName, email: input.email, hash, type: input.type},
                    (err, res) => {
                        request.session.user = res.email;
                    });
            });
        });   
    },
    signin: ({ email, password }, request) => {
        User.findOne({email}, (err, item) => {
            if (!item) return;
            bcrypt.compare(password, item.hash, (err, result) => {
                request.session.user = email;
            });
        });
    }
}

dotenv.config();
db.connect();

let app = express();

app.use(session({
    secret: process.env.PASSWORD_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(function (req, res, next){
    req.username = (req.session.user)? req.session.user._id : null;
    next();
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
