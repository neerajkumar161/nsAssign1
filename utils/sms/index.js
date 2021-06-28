const config = require("config");
const nodemailer = require("nodemailer");
const accountSid = config.get("TWILIO_ACCOUNT_SID");
const authToken = config.get("TWILIO_AUTH_TOKEN");
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  service: "Gmail",
  auth: {
    user: config.get("EMAIL_SERVICE").EMAIL,
    pass: config.get("EMAIL_SERVICE").PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (to, subject, message) => {
  return await transporter.sendMail({
    from: config.get("EMAIL_SERVICE").EMAIL,
    to: to, // list of receivers
    subject: subject,
    text: message,
    // html: message, // html body
  });
};

const client = require("twilio")(accountSid, authToken);
const sendOtp = async (to, subject) => {
  return await client.messages
    .create({
      body: subject,
      from: config.get("PHONE"),
      to: to,
    })
    .then((message) => console.log(message.sid));
};
module.exports = {
  sendEmail,
  sendOtp,
};
