const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClassroomSchema = new Schema({
  name: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  schoolId: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
