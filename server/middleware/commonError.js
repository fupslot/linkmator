'use strict';
module.exports = function(err, req, res, next) {
  res.status(500).json({
    name: 'Error',
    status: 500,
    errors: [{
      message: err.message
    }]
  });
};
