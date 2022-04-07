const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    classId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);