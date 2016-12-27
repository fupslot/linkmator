'use strict';
const mongoose = require('mongoose');
const Url = require('url');

const util = require('../util');

class ImageUrlObject {
  constructor(data) {
    if (typeof data.url !== 'string') {
      throw new TypeError(`"url" must be string and got ${typeof data.url}`);
    }

    // No protocol
    if (data.url.startsWith('//')) {
      this.url = 'https:' + data.url;
    } else {
      this.url = data.url;
    }

    this._id = new mongoose.Types.ObjectId();

    const config = require('node-config-files')('./server/config');
    const parseUrl = Url.parse(this.url);

    this.hash_url = util.getStringHash(this.url);

    this.s3_bucket = config.common.s3.bucket;
    this.s3_object_key = `${config.common.s3.objectKey}/${parseUrl.hostname}/${this.hash_url}`;
    this.protocol = parseUrl.protocol.substr(0, parseUrl.protocol.length - 1);
    this.type = data.type;
    this.width = data.width;
    this.height = data.height;
  }
}

module.exports = ImageUrlObject;
