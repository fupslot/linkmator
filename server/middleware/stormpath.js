'use strict';
const stormpath = require('express-stormpath');

module.exports = function(app, oConfig) {
  const oSettings = {};

  oSettings.application = {
    href: oConfig.env.stormpath.app_href
  };

  oSettings.web = {
    login: {
      nextUri: '/app'
    },

    logout: {
      nextUri: '/login'
    }
  };

  return stormpath.init(app, oSettings);
};
