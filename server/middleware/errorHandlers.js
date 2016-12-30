'use strict';
const STATUS = require('http').STATUS_CODES;

module.exports = function(req, res, next) {
  res.sendRequestError = function(error) {
    const CODE_STATUS = 400;
    let message = STATUS[CODE_STATUS];

    if (error && error.message) {
      message = `${STATUS[CODE_STATUS]} - ${error.message}`;
    }

    const data = {
      name: 'RequestError',
      status: CODE_STATUS,
      errors: [{
        message: message
      }]
    };

    res.status(200).json(data);
  };

  next();
};
