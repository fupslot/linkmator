'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    owner: {
      type: Schema.ObjectId,
      ref: 'Person',
      require: true
    },

    graph: {
      type: Schema.ObjectId,
      ref: 'Graph',
      require: true
    },

    sharedBy: {
      type: Schema.ObjectId,
      ref: 'Person',
    },
    sharedAt: Date,

    clickCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', PostSchema);
