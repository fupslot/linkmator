'use strict';

module.exports = () => {
  return {
    uri: process.env.MONGO_URI_TEST,
    options: { }
  };
};
