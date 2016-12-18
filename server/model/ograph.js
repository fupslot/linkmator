'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const OGraphSchema = new Schema(
  {
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
    url: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        msg: '{PATH} is not valid'
      }
    },
    image: [{
      url: {
        type: String,
        required: true,
        validate: {
          validator: validator.isURL,
          msg: '{PATH} is not valid'
        }
      },
      secure_url: {
        type: String,
        validate: {
          validator: validator.isURL,
          msg: '{PATH} is not valid'
        }
      },
      type: {
        type: String
      },
      width: String,
      height: String,
    }],
    type: String,
    site: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resource', OGraphSchema);
