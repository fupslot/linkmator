'use strict';
const Mailgun = require('mailgun-js');

module.exports = ({to, sharedUrl}, callback) => {

  const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const data = {
    from: 'support@linkmator.com',
    to: to,
    subject: 'Linkmator | Shared a post',
    html: `Hello, ${to}. We glad to inform you that someone just shared a post with you ${sharedUrl}`
  };

  mailgun.messages().send(data, callback);
};
