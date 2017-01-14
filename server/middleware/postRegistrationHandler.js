'use strict';

const createPerson = require('../lib/person/create');
const updatePersonById = require('../lib/person/updateById');
const findPersonByEmail = require('../lib/person/findByEmail');

module.exports = (account, req, res, next) => {
  const updateStormpathAccount = (person) => {
    return new Promise((resolve, reject) => {
      account.customData.mongoId = person._id;
      account.customData.save((err) => {
        if (err) { return reject(err); }
        return resolve(person);
      });
    });
  };

  return findPersonByEmail(account.email).then((person) => {
    if (person) {
      return updatePersonById(person._id, account);
    }
    return createPerson(account);
  }).then(updateStormpathAccount).then(next).catch(next);
};
