'use strict';

const sendEmail = require('../util/email/send');

// This is really all the job service does. The key is the handlers object.
exports.processTask = (taskName, sentStamp, body, callback) => {
  if (taskName in handlers) {
    handlers[taskName](sentStamp, body, callback);
  } else {
    callback(new Error(`No handler for task ${taskName}`));
  }
};


// This object maps task names to the jobs that handle them
const handlers = {
  'WelcomeEmail': (sendStamp, body, callback) => {
    console.log('SQS | WelcomeEmail');
    sendEmail(body, callback);
  },
  'recordEvent': (sendStamp, body, callback) => {
    console.log('SQS | RecordEvent');
    callback();
  }
};
