const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    schoolId: { type: String, required: true },
    type: { type: String, required: true },
    isVerified: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

UsersSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60*60*24, partialFilterExpression: { isVerified: false } }
);

module.exports = mongoose.model("Users", UsersSchema);
