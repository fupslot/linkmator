'use strict';
const Url = require('url');
const crypto = require('crypto');
const config = require('node-config-files')('./server/config');

module.exports.getStringHash = function(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
};

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

/**
 * getMD5Hash
 * Returns Md5 hash of a given string
 * @param  {String} text A string
 * @return {String}      Hash
 */
module.exports.getMD5Hash = (text) => {
  return crypto.createHash('md5').update(text, 'utf8').digest('hex');
};

module.exports.createGravatarUrl = (emailMd5Hash) => {
  const {gravatarUrl} = config.common.server;
  return `${gravatarUrl}/${emailMd5Hash}?d=identicon`;
};

module.exports.toLowerCase = (text) => {
  return String.prototype.toLowerCase.call(text);
};
