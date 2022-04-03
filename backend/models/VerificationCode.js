const mongoose = require("mongoose");
const { Schema } = mongoose;

const VerificationCodeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, expires: 60*60*24, default: Date.now },
});

module.exports = mongoose.model("VerificationCode", VerificationCodeSchema);

//{email:"cwashofcwans3@gmail.com"}
