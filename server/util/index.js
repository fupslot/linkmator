'use strict';
const Url = require('url');
const crypto = require('crypto');

module.exports.getImageUrlObject = function(url) {
  const hash = crypto.createHash('sha256');
  hash.update(url, 'utf8');
  const hashUrl = hash.digest('hex');

  const hostname = Url.parse(url).hostname;

  return {
    url,
    hashUrl,
    hostname,
    s3ObjectKey: `${hostname}/${hashUrl}`
  };
};
