'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const util = require('../util');

const OpenGraphSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      index: 'hashed',
      validate: {
        validator: validator.isURL,
        msg: '{PATH} is not valid'
      }
    },

    hostname: {
      type: String,
      required: true
    },

    url_hash: {
      type: String,
      index: true
    },

    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: [
        2048,
        'The value of path `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).'
      ]
    },
    image: [{
      type: Schema.ObjectId,
      rel: 'ImageObject'
    }],
    type: String,
    site: String
  },
  {
    timestamps: true
  }
);


OpenGraphSchema.pre('save', function(next) {
  if (!this.url_hash) {
    this.url_hash = util.getStringHash(this.url);
  }
  next();
});

module.exports = mongoose.model('OpenGraph', OpenGraphSchema);
