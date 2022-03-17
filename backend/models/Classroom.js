const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClassroomSchema = new Schema({
    name: String,
    schoolId: String,
    code: String
})

module.exports = mongoose.model('Classroom', ClassroomSchema);