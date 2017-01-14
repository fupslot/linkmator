'use strict';

// The Mediator service provides the application with a controlled pubsub
// capability.
//
// 1. Application services publish events to the Mediator
// 2. The Mediator maintains lists of subscriptions for these events
// 3. When an event is published, the Mediator enqueus each associated task
const async = require('async');

const QueuingService = require('./queuing-service');

// The subscriptions object provides the one-to-many linkage between published
// events and the module's internal event handlers. The keys are event names,
// and the values are arrays of function names.
const subscriptions = {
  'user-create': [
    'WelcomeEmail'
  ],
  'feed-share': [
    'FeedShare'
  ]
};

exports.publishEvent = (eventName, docObject, callback) => {
  console.log(`EVENT | ${eventName} ${(new Date()).toISOString()} ${JSON.stringify(docObject)}`);

  // First we will record the event for later offline processing
  QueuingService.enqueue('recordEvent', docObject, (error) => {
    if (error) {
      return callback(error);
    }

    // Then we enqueue tasks for each subscription above.
    if (subscriptions[eventName]) {
      return async.each(subscriptions[eventName], (task, done) => {
        QueuingService.enqueue(task, docObject, done);
      }, callback);
    } else {
      return callback(
        new Error(`No handler for event ${eventName}`)
      );
    }
  });
};
