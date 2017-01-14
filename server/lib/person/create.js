'use strict';
const util = require('../../util');
const Person = require('../../model/person');

module.exports = (attrs) => {
  if (!attrs.email) {
    return Promise.reject(new Error('email is required'));
  }

  const emailMd5Hash = util.getMD5Hash(attrs.email);
  const gravatarUrl = util.createGravatarUrl(emailMd5Hash);

  return Person.create(
    Object.assign({
      gravatarUrl,
      emailMd5Hash
    }, attrs)
  );
};
