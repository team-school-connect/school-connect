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

const sendVerificationEmail = (to, link) => {
  let message = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your SchoolConnect Account",
    text: "Thank you for signing up for SchoolConnect. Please verify your account by clicking the link below",
    html: `<div><p>Thank you for signing up for SchoolConnect. Please verify by clicking the link below.</p> <a href="https://www.google.ca">google.ca</a></div>`,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Sent Email");
    console.log(info);
  });
};

exports.sendVerificationEmail = sendVerificationEmail;
