const mongoose = require("mongoose");
const { Schema } = mongoose;

const checkIsFull = (size) => {
  size < 4;
};

const StudyRoomSchema = new Schema({
  roomName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participantCount: {
    type: Number,
    validate: [checkIsFull, "Sorry this room is full!"],
    required: true,
  },
  subject: { type: String, required: true },
  createdOn: { type: Date, required: true },
});

module.exports = mongoose.model("StudyRoom", StudyRoomSchema);
