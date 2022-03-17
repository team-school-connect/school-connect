const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClassroomUser = new Schema({
    userEmail: String,
    classCode: String
});

module.exports = mongoose.model('ClassroomUser', ClassroomUser);