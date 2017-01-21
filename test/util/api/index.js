'use strict';

module.exports = function(server) {
  return {
    posts: require('./posts')(server)
  };
};
