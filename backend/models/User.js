const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    hash: String,
    type: String
});

module.exports = mongoose.model('Users', UsersSchema);
