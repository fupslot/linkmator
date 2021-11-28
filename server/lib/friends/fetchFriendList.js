const FriendModel = require('../../model/friend.model');
// const PersonModel = require('../../model/person');

module.exports = function fetchFriendList({UID, query}) {
  function populateFriendList(friendList) {
    const options = {
      path: 'invitee',
      select: '-_v',
      model: 'Person'
    };

    return FriendModel.populate(friendList, options);
  }

  return FriendModel.find(
    {
      '$text': { '$search': query }
    },
    {
      score: { $meta: 'textScore' }
    }
  )
    .where('inviter').equals(UID)
    .exec()
    .then(populateFriendList);
};
