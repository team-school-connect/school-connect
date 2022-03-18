const mongoose = require("mongoose");
const { Schema } = mongoose;

const checkIsFull = (size) => {
  return size < 4;
};

const StudyRoomSchema = new Schema({
  roomName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participantCount: {
    type: Number,
    max: 4,
    required: true,
  },
  subject: { type: String, required: true },
  createdOn: { type: Date, required: true },
});

module.exports = mongoose.model("StudyRoom", StudyRoomSchema);
