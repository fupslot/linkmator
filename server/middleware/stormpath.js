'use strict';
const stormpath = require('express-stormpath');

module.exports = function(app, config) {
  const settings = {
    application: {
      href: config.common.stormpath.app_href
    },

    web: {
      login: {
        nextUri: '/app'
      },
      logout: {
        nextUri: '/login'
      },
      me: {
        expand: {
          customData: true
        }
      }
    },

    expand: {
      customData: true
    },

    postRegistrationHandler: require('./postRegistrationHandler')
  };

  return stormpath.init(app, settings);
};
