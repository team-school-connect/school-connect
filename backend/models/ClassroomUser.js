const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClassroomUser = new Schema({
  userEmail: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  className: { type: String, required: true },
});

module.exports = mongoose.model("ClassroomUser", ClassroomUser);
