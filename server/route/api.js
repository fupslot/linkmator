'use strict';
const express = require('express');
const requestUrlOpenGraph = require('request-url-open-graph');
const validator = require('validator');
const config = require('node-config-files')('./server/config');
const util = require('../util');
const router = express.Router();


/**
 * POST /api/get
 */
router.post('/api/og', function(oReq, oRes) {
  const data = oReq.body;
  const url = data.url || '';

  if (!validator.isURL(url)) {
    return oRes.sendValidationModelError({
      errors: {
        url: {
          path: 'url',
          message: '"url" must be valid',
          value: url
        }
      }
    });
  }

  requestUrlOpenGraph({url}, function(oError, oTags) {
    if (oError) {
      return oRes.sendServerError(oError);
    }

    const OGraph = require('../model/ograph');
    const oOGraph = new OGraph(oTags);

    oOGraph.validate().then(() => {
      const promises = [];

      if (Array.isArray(oOGraph.image)) {
        const s3 = require('../lib/s3-image-upload')({
          bucket: config.common.s3.bucket
        });

        oOGraph.image.map(function(image) {
          const imageUrlObject = util.getImageUrlObject(image.url);
          image.hash_url = imageUrlObject.hashUrl;
          image.s3_object_key = imageUrlObject.s3ObjectKey;
          promises.push(s3.upload(imageUrlObject));
          return image;
        });
      }

      promises.unshift(oOGraph.save());
      return Promise.all(promises);
    }).then(function(results) {
      oRes.status(201).send({
        status: 201,
        data: results[0].toJSON()
      });
    }).catch((oError) => {
      if (oError.name === 'ValidationError') {
        oRes.sendValidationModelError(oError);
      } else {
        oRes.sendServerError(oError);
      }
    });
  });
});

module.exports = router;
