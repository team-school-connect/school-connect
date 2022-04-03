const ShortUniqueId = require("short-unique-id");
const { sendVerificationEmail } = require("../email");
const School = require("../models/School");
const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");

const sendVerificationCode = async (userId, email) => {
  const code = new ShortUniqueId({ length: 32 })();
  await VerificationCode.create({
    userId,
    code,
  });
  await sendVerificationEmail(email, code);
};

const onVerificationCodeSentError = (userId, schoolName) => {
  User.deleteOne({ _id: userId }).exec();
  VerificationCode.deleteMany({ userId }).exec();
  if (schoolName) School.deleteOne({ name: schoolName });
};

exports.sendVerificationCode = sendVerificationCode;
exports.onVerificationCodeSentError = onVerificationCodeSentError;
