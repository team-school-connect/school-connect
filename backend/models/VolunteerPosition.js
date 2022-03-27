const mongoose = require("mongoose");
const { Schema } = mongoose;

const VolunteerPositionSchema = new Schema({
  posterId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  organizationName: { type: String, required: true },
  positionName: { type: String, required: true },
  positionDescription: { type: String, required: true },
  schoolId: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

module.exports = mongoose.model("VolunteerPosition", VolunteerPositionSchema);