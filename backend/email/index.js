const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  tls: { minVersion: "TLSv1" },
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

exports.sendVerificationEmail = sendVerificationEmail;
