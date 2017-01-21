'use strict';
const AWS = require('aws-sdk');
const request = require('request');
const config = require('node-config-files')('./server/config');


module.exports = function(imageObject) {
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
        Bucket: imageObject.s3Bucket,
        Key: imageObject.s3Key,
        Body: response,
        ContentType: response.headers['content-type'],
        ContentLength: response.headers['content-length']
      };

      return s3.putObject(params, function(err, response) {
        if (err) {
          // Note: should be reported to a log system
          return resolve(err);
        }
        return resolve(imageObject);
      });
    }

    request.get({
      url: imageObject.originalUrl,
      headers: {
        'User-Agent': config.common.server.userAgent
      }
    }).on('response', writeToS3);
  });
};
