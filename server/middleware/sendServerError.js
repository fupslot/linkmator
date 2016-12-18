'use strict';

module.exports = function(req, res, next) {
  res.sendServerError = function(oError) {
    const data = {
      name: 'ServerError',
      status: 500,
      errors: [{
        message: oError.message
      }]
    };

    res.status(500).json(data);
  };

  next();
};
