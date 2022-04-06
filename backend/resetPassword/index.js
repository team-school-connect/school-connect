const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt");
const { sendPasswordResetEmail } = require("../email");
const ResetPassword = require("../models/ResetPassword");

const sendPasswordReset = async (userId, email) => {
  const password = new ShortUniqueId({ length: 32 })();
  const hash = await bcrypt.hash(password, 10);
  await ResetPassword.deleteMany({ userId }).exec();
  await ResetPassword.create({
    userId,
    hash,
  });
  await sendPasswordResetEmail(email, password);
};

const onPasswordResetSentError = (userId) => {
  ResetPassword.deleteMany({ userId }).exec();
};

exports.sendPasswordReset = sendPasswordReset;
exports.onPasswordResetSentError = onPasswordResetSentError;
