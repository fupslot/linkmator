'use strict';
const Url = require('url');
const crypto = require('crypto');

module.exports.getImageUrlObject = function(url) {
  const hash = crypto.createHash('sha256');
  hash.update(url, 'utf8');
  const hash_url = hash.digest('hex');

  const hostname = Url.parse(url).hostname;

  return {
    url,
    hash_url,
    hostname,
    s3_object_key: `${hostname}/${hash_url}`
  };
};
