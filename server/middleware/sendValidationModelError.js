'use strict';
const pick = require('lodash/pick');

module.exports = function(req, res, next) {
  res.sendValidationModelError = function(oError) {
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

    res.status(400).json(data);
  };

  next();
};
