'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema(
  {
    inviter: {
      type: Schema.ObjectId,
      ref: 'Person'
    },
    invitee: {
      type: Schema.ObjectId,
      ref: 'Person'
    },

    inviteeUsername: {
      type: String,
      text: true
    },

    inviteeGivenName: {
      type: String,
      text: true
    },

    inviteeSurname: {
      type: String,
      text: true
    },

    approved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Friend', FriendSchema);
