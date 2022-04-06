const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (to, code) => {
  const link = `${process.env.ORIGIN}/#/verify/${code}`;
  let message = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your SchoolConnect Account",
    text: `Thank you for signing up for SchoolConnect. Please verify your account by clicking the link below ${link}`,
    html: `<div><p>Thank you for signing up for SchoolConnect. Please verify by clicking the link below.</p> <a href="${link}">${link}</a></div>`,
  };

  return transporter.sendMail(message);
};

const sendPasswordResetEmail = (to, password) => {
  const link = `${process.env.ORIGIN}/#/resetPassword/${password}`;
  let message = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Reset your SchoolConnect Account Password",
    text: `You have requested to reset your SchoolConnect password. Please click the following link to reset your password. ${link}`,
    html: `<div><p>You have requested to reset your SchoolConnect password. Please click the following link to reset your password.</p> <a href="${link}">${link}</a></div>`,
  };

  return transporter.sendMail(message);
};



exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
