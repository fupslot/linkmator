'use strict';
const Url = require('url');
const crypto = require('crypto');

class ImageUrlObject {
  constructor(data) {
    if (typeof data.url !== 'string') {
      throw new TypeError(`"url" must be string and got ${typeof data.url}`);
    }

    // No protocol
    if (data.url.startsWith('//')) {
      this.url = 'https:' + data.url;
    }

    const config = require('node-config-files')('./server/config');

    const hash = crypto.createHash('sha256');
    hash.update(this.url, 'utf8');
    const parseUrl = Url.parse(this.url);

    this.hash_url = hash.digest('hex');
    this.s3_bucket = config.common.s3.bucket;
    this.s3_object_key = `${config.common.s3.objectKey}/${parseUrl.hostname}/`;
    this.protocol = parseUrl.protocol.substr(0, parseUrl.protocol.length - 1);
    this.type = data.type;
    this.width = data.width;
    this.height = data.height;
  }
}

module.exports = ImageUrlObject;
