const mongoose = require('mongoose');
const { Schema } = mongoose;

const SchoolSchema = new Schema({
    name: String
});

module.exports = mongoose.model('School',SchoolSchema);