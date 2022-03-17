const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
    title: String,
    content: String,
    classId: String
}, {timestamps: true});

module.exports = mongoose.model('Announcement', AnnouncementSchema);