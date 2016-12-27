'use strict';
const Person = require('../model/person');

module.exports = (account, req, res, next) => {
  Person.create(account).then((person) => {
    account.customData.mongoId = person._id;
    account.customData.save(next);
  }).catch(next);
};
