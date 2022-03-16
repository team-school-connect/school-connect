const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  studyRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "StudyRoom" },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
