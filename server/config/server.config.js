'use strict';

/* eslint-disable */

module.exports = () => {
  return {
    env: process.env.NODE_ENV,
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    test_user_name: process.env.TEST_USER_NAME,
    test_user_password: process.env.TEST_USER_PASSWORD,
    webpack_server_port: process.env.WEBPACK_SERVER_PORT,

    gravatarUrl: '//www.gravatar.com/avatar',
    cdnHost: '//d3rdc2hbfr3zgy.cloudfront.net',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36'
  };
};
