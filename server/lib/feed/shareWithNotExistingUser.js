'use strict';
const createPerson = require('../person/create');
const shareFeedWithExistingUser = require('./shareWithExistingUser');
const findPersonByEmail = require('../person/findByEmail');

module.exports = ({feedId, feedOwnerId, recipient}) => {
  return findPersonByEmail(recipient)
    .then((person) => {
      if (!person) {
        return createPerson({email: recipient});
      }
      return person;
    })
    .then((person) => {
      return shareFeedWithExistingUser({
        feedId,
        feedOwnerId,
        recipient: person._id
      });
    });
};
