'use strict';
const pick = require('lodash/pick');

module.exports = function(req, res, next) {
  res.sendModelValidationError = function(oError) {
    const aErrors = [];

    for (const prop in oError.errors) {
      const error = pick(oError.errors[prop], ['path', 'message', 'value']);
      aErrors.push(error);
    }

    const data = {
      name: 'ValidationError',
      status: 400,
      errors: aErrors
    };

    res.status(200).json(data);
  };

  next();
};
