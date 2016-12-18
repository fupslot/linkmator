'use strict';

module.exports = () => {
  return {
    env: process.env.NODE_ENV,
    hostname: process.env.HOSTNAME,
    port: process.env.PORT
  };
};
