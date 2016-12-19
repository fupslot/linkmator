'use strict';
// const Url = require('url');
const http = require('http');
const https = require('https');
const AWS = require('aws-sdk');
// const crypto = require('crypto');
const config = require('node-config-files')('./server/config');
// const util = require('../util');

module.exports = function(options) {
  const awsConfig = new AWS.Config({
    accessKeyId: config.common.s3.accessKeyId,
    secretAccessKey: config.common.s3.secretAccessKey,
    region: config.common.s3.region
  });

  function upload(imageUrlObject) {
    return new Promise(function(resolve) {
      if (typeof imageUrlObject.url !== 'string') {
        return resolve(
          new TypeError(`Expect "url" to be string and got ${typeof url}`)
        );
      }

      const url = imageUrlObject.url;
      const request = url.startsWith('https') ? https : http;

      request.get(url, function(response) {
        if (response.statusCode !== 200) {
          return resolve(
            new Error(`Expected status 200 and got ${response.statusCode}`)
          );
        }

        const s3 = new AWS.S3(awsConfig);

        var params = {
          Bucket: options.bucket,
          Key: imageUrlObject.s3ObjectKey,
          Body: response,
          ContentType: response.headers['content-type'],
          ContentLength: response.headers['content-length']
        };

        s3.putObject(params, function(err, response) {
          if (err) {
            return resolve(err);
          }
          return resolve({key: imageUrlObject.s3ObjectKey});
        });
      });

    });
  }

  return {upload};
};
