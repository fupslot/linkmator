'use strict';
const async = require('async');
const AWS = require('aws-sdk');

const AWS_QUEUE_URL = 'https://sqs.eu-west-1.amazonaws.com/852474980684/mailer-queue';

const sqs = new AWS.SQS({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

const sqsQueueUrl = (priority) => {
  return `${AWS_QUEUE_URL}#development-${priority}`;
};

const removeFromQueue = (message, callback) => {
  sqs.deleteMessage({
    QueueUrl: sqsQueueUrl('high'),
    ReceiptHandle: message.ReceiptHandle
  }, callback);
};

exports.enqueue = (taskName, docObject, callback) => {
  // We are going to extend the doc with our own fields, so let's ensure we
  //  aren't overwriting anything passed to us.
  if ('sqsFields' in docObject) {
    const msg = 'Do not pass the field "sqsFields" to QueuingService.enqueue.';
    return callback(new Error(msg));
  }

  // We ran into API complications with using SQS Message Attributes, so this
  // is a simple enough workaround.
  const msgBody = Object.assign({
    sqsFields: {
      taskName: taskName,
      sentStamp: (new Date()).toISOString()
    }
  }, docObject);

  const messageParams = {
    MessageBody: JSON.stringify(msgBody),
    QueueUrl: sqsQueueUrl('high')
  };

  sqs.sendMessage(messageParams, callback);

  return 0;
};

// This is the function that a worker would call to process queue messages
// indefinitely.
exports.listen = (handler) => {
  // This listener relies on Amazon SQS long polling. The readMessage function
  // calls itself recursively, but only once each time itself is called, which
  // prevents memory leaks.

  const readMessage = () => {
    const messageParams = {
      QueueUrl: sqsQueueUrl('high'),
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 60,
      WaitTimeSeconds: Number(process.env.WORKER_WAIT_TIME_SECONDS)
    };

    sqs.receiveMessage(messageParams, (error, data) => {
      error && console.log(error);

      if (data && data.Messages) {
        const Messages = data.Messages;
        console.log(`SQS | Retrieved ${Messages.length} messages`);

        // The receiveMessage function returns an array of messages, so we will
        // use async to process them in parallel, callings readMessage again
        // once they have all been run.

        async.each(Messages, (message, done) => {
          const body = JSON.parse(message.Body);
          const taskName = body.sqsFields.taskName;
          const sentStamp = body.sqsFields.sentStamp;

          console.log(`SQS | Handling ${taskName}`);
          handler(taskName, sentStamp, body, (error) => {
            if (error) {
              console.log(`SQS | ERROR ${error}`);
              return done(error);
            }

            return removeFromQueue(message, done);
          });
        }, readMessage);
      } else {
        console.log('SQS | No messages to process');
        readMessage();
      }
    });
  };

  readMessage();
};
