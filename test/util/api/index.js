'use strict';

module.exports = function(server) {
  return {
    feed: require('./feed')(server)
  };
};
