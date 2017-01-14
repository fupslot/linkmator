'use strict';
const Person = require('../../model/person');
const pick = require('lodash.pick');

module.exports = (id, attrs) => {
  attrs = pick(attrs, ['href', 'username', 'givenName', 'surname']);
  return Person.findByIdAndUpdate(id, attrs, {new: true});
};
