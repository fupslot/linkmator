'use strict';
const createPerson = require('../person/create');
const shareFeedWithExistingUser = require('./shareWithExistingUser');
const findPersonByEmail = require('../person/findByEmail');

const mediator = require('../../../worker/lib/mediator');
const config = require('node-config-files')('./server/config');

module.exports = ({postId, postOwnerId, recipient}) => {
  const sendFeedShareEmail = (person) => {
    return new Promise((resolve) => {
      const {baseUrl} = config.common.server;
      const sharedUrl = `${baseUrl}/login?email=${recipient}`;
      mediator.publishEvent(
        'feed-share',
        {
          to: person.email,
          sharedUrl
        },
        (error) => {
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
        postId,
        postOwnerId,
        recipient: person._id
      });
    });
};
