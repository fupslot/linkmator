'use strict';
const createPerson = require('../person/create');
const shareFeedWithExistingUser = require('./shareWithExistingUser');
const findPersonByEmail = require('../person/findByEmail');

const mediator = require('../../../worker/lib/mediator');


module.exports = ({feedId, feedOwnerId, recipient}) => {
  const sendFeedShareEmail = (person) => {
    return new Promise((resolve) => {
      mediator.publishEvent('feed-share', {to: person.email}, (error) => {
        if (error) {
          console.log(`APP | ERROR: ${error}`);
        }
        resolve(person);
      });
    });
  };

  return findPersonByEmail(recipient)
    .then((person) => {
      if (!person) {
        return createPerson({email: recipient});
      }
      return person;
    })
    .then(sendFeedShareEmail)
    .then((person) => {
      return shareFeedWithExistingUser({
        feedId,
        feedOwnerId,
        recipient: person._id
      });
    });
};
