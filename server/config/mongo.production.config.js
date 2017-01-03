'use strict';

module.exports = () => {
  return {
    uri: process.env.MONGO_URI,
    options: { }
  };
};
