'use strict';
const PersonModel = require('../../model/person');
const FriendModel = require('../../model/friend.model');

module.exports = function addAsFriendById(UID, inviteeId) {
  return PersonModel.findById(inviteeId)
    .exec()
    .then((person) => {
      return FriendModel.create({
        inviter: UID,
        invitee: inviteeId,
        inviteeUsername: person.username,
        inviteeGivenName: person.givenName,
        inviteeSurname: person.surname
      });
    });
};
