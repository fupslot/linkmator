'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TYPE_VALUES = [
  'PUBLIC',
  'PRIVATE',
  'SHARED'
];

const typeValidator = (value) => {
  return TYPE_VALUES.includes(value);
};

const Feed = new Schema(
  {
    creator: {
      type: Schema.ObjectId,
      ref: 'Person',
      require: true
    },
    opengraph: {
      type: Schema.ObjectId,
      ref: 'OpenGraph',
      require: true
    },
    type: {
      type: String,
      default: 'PRIVATE',
      validate: [
        typeValidator,
        '{PATH} doesn\'t match {VALUE}'
      ]
    },

    sharedBy: {
      type: Schema.ObjectId,
      ref: 'Person',
    },
    sharedAt: Date,

    downvoteCount: {
      type: Number,
      default: 0
    },
    upvoteCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feed', Feed);
