const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
    title: String,
    content: String,
    className: String,
    author: String
}, {timestamps: true});

module.exports = mongoose.model('Announcement', AnnouncementSchema);