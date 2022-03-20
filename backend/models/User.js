const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  schoolId: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Users", UsersSchema);
