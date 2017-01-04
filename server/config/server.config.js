'use strict';

module.exports = () => {
  return {
    env: process.env.NODE_ENV,
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    test_user_name: process.env.TEST_USER_NAME,
    test_user_password: process.env.TEST_USER_PASSWORD,
    webpack_server_port: process.env.WEBPACK_SERVER_PORT,

    gravatarUrl: 'https://www.gravatar.com/avatar'
  };
};
