'use strict';
const express = require('express');
const stormpath = require('express-stormpath');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = function(app, oConfig) {
  const router = express.Router();

  router.use(require('./stormpath')(app, oConfig));

  router.use(cookieParser());
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.use('/api/*', stormpath.loginRequired);

  router.use(require('./commonError'));
  router.use(require('./sendValidationModelError'));
  router.use(require('./sendServerError'));

  return router;
};
