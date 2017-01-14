'use strict';
const Person = require('../model/person');
const util = require('../util');
const mediator = require('../../worker/mediator');

module.exports = (account, req, res, next) => {
  const emailMd5Hash = util.getMD5Hash(account.email);
  const gravatarUrl = util.createGravatarUrl(emailMd5Hash);


  const person = {
    username: account.username,
    email: account.email,
    href: account.href,
    givenName: account.givenName,
    surname: account.surname,
    gravatarUrl,
    emailMd5Hash
  };


  return Person.create(person).then((model) => {
    mediator.publishEvent(
      'user-create',
      {to: account.email},
      (error) => error && console.log(error));

    account.customData.mongoId = model._id;
    account.customData.save(next);

    return model;
  }).catch(next);
};
