'use strict';
// const util = require('../../util');
const Person = require('../../model/person');

module.exports = (email) => {
  if (!email) {
    return Promise.reject(new Error('email is required'));
  }

  return Person.findOne({email})
    .select('-__v')
    .exec();
};
