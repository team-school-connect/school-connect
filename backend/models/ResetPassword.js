const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResetPasswordSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, expires: 60 * 60, default: Date.now },
});

module.exports = mongoose.model("ResetPassword", ResetPasswordSchema);
