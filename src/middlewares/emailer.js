const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

module.exports = (email, subject, text) => {
  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Mailer error", err);
      console.log("Email not send");
    } else {
      console.log("Email sended");
      return "Email sended";
    }
  });
};
