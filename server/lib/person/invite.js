'use string';
const createPerson = require('./create');

module.exports = (email) => {
  // 1. create new Person
  // 2. create new feed
  return createPerson({email}).then();
};
