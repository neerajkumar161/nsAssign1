const config = require('config');
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const smtpTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: config.get('NODE_MAILER.USER'),
    pass: config.get('NODE_MAILER.PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMailTransporter = (mailOptions) => {
  try {
    return smtpTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw 'Sending Email Error';
      }

      console.log('Message sent to: %s', info.accepted);
      console.log('Message sent from: %s', info.envelope);
    });
  } catch (err) {
    throw 'Something Went Wrong!';
  }
};

exports.sendSignUpEmail = (to, subject, body) => {
  const mailOptions = {
    from: config.get('NODE_MAILER.USER'),
    to: to, // list of receivers
    subject: `${subject}`,
    html: `<h2>${subject}</h2>` + "<h4 style='font-weight:bold;'>" + body + '</h4>', // html body
  };
  return sendMailTransporter(mailOptions);
};

exports.sendForgotPasswordEmail = (to, subject, body) => {
  const mailOptions = {
    from: config.get('NODE_MAILER.USER'),
    to: to,
    subject: `${subject}`,
    html: `<h2>${subject}</h2>` + "<h4 style='font-weight:bold;'>" + body + '</h4>', // html body
  };
  return sendMailTransporter(mailOptions);
};
