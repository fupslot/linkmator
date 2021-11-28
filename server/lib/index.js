'use strict';

module.exports = {
  // posts: require('./feed'),
  // person: require('./person')
  friends: {
    fetchFriendList: require('./friends/fetchFriendList'),
    addAsFriendById: require('./friends/addAsFriendById')
  }
};
