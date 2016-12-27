'use strict';
const stormpath = require('express-stormpath');

module.exports = function(app, config) {
  const settings = {
    application: {
      href: config.env.stormpath.app_href
    },

    web: {
      login: { nextUri: '/app' },
      logout: { nextUri: '/login' }
    },

    expand: { customData: true },

    postRegistrationHandler: require('./postRegistrationHandler')
  };

  return stormpath.init(app, settings);
};
