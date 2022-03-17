const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
    title: String,
    content: String,
    classId: String
})

module.exports = mongoose.model('Announcement', AnnouncementSchema);