const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  studyRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "StudyRoom", required: true },
  socketId: { type: String, required: true },
  // participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
