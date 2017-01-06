'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageObject = new Schema(
  {
    url: {
      type: String,
      required: true,
      index: 'hashed'
    },
    hash_url: {
      type: String,
      index: true,
      required: true
    },
    // s3_bucket - should be absolite
    s3_bucket: {
      type: String,
      required: true
    },
    s3_object_key: {
      type: String,
      required: true
    },
    // protocol - should be absolite
    protocol: String,
    type: {
      type: String
    },
    // width/hight - should be absolite
    width: String,
    height: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ImageObject', ImageObject);
