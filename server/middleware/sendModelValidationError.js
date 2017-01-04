'use strict';
const pick = require('lodash/pick');

module.exports = function(req, res, next) {
  res.sendModelValidationError = function(path, message, value) {
    const errors = [];

    if (arguments.length === 1) {
      const data = path;

      if (data && typeof data.errors === 'object') {
        for (const prop in data.errors) {
          errors.push(
            pick(data.errors[prop], ['path', 'message', 'value'])
          );
        }
      } else {
        throw new Error('errors object not found');
      }
    } else if (arguments.length === 3) {
      errors.push({path, message, value});
    } else {
      throw new Error('function expects 1 or 3 arguments');
    }

    res.status(200).json({
      name: 'ValidationError',
      status: 400,
      errors: errors
    });
  };

  next();
};
