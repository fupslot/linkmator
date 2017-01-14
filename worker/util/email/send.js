'use strict';

// const nodemailer = require('nodemailer');
const Mailgun = require('mailgun-js');
// const mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
// const auth = {
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN
//   }
// };

module.exports = (body, callback) => {
  // const nodemailerMailgun = nodemailer.createTransport(mg(auth));
  // console.log(`MAILER | Send email to ${body.to}`);
  // nodemailerMailgun.sendMail({
  //   from: 'support@linkmator.com',
  //   to: body.to, // An array if you have multiple recipients.
  //   subject: 'Linkmator | Shared a post',
  //   //You can use "text:" to send plain-text content. It's oldschool!
  //   text: `Hello, ${body.to}. We glad to inform you that someone just shared a post with you.`
  // }, callback);


  const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const data = {
    from: 'support@linkmator.com',
    to: body.to, // An array if you have multiple recipients.
    subject: 'Linkmator | Shared a post',
    html: `Hello, ${body.to}. We glad to inform you that someone just shared a post with you.`
  };

  mailgun.messages().send(data, callback);
};
