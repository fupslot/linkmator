'use strict';
const AWS = require('aws-sdk');
const request = require('request');
// const crypto = require('crypto');
const config = require('node-config-files')('./server/config');
// const util = require('../util');

module.exports = function(imageUrlObject) {
  const awsConfig = new AWS.Config({
    accessKeyId: config.common.s3.accessKeyId,
    secretAccessKey: config.common.s3.secretAccessKey,
    region: config.common.s3.region
  });

  return new Promise(function(resolve) {
    function writeToS3(response) {
      if (response.statusCode !== 200) {
        return resolve(
          new Error(`Expected status 200 and got ${response.statusCode}`)
        );
      }

      const s3 = new AWS.S3(awsConfig);

      var params = {
        Bucket: imageUrlObject.s3_bucket,
        Key: imageUrlObject.s3_object_key,
        Body: response,
        ContentType: response.headers['content-type'],
        ContentLength: response.headers['content-length']
      };

      s3.putObject(params, function(err, response) {
        if (err) {
          // Note: should be reported to a log system
          return resolve(err);
        }
        return resolve(imageUrlObject);
      });
    }

    const url = imageUrlObject.url;
    request.get(url).on('response', writeToS3);
  });
};
