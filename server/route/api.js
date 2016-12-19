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
    // debugger;

    oOGraph.validate().then(() => {
      const promises = [];

      if (Array.isArray(oTags.image)) {
        const s3 = require('../lib/s3-image-upload')({
          bucket: config.common.s3.bucket
        });

        oTags.image.forEach(function(image) {
          const imageUrlObject = Object.assign(
            {},
            image,
            util.getImageUrlObject(image.url)
          );

          promises.push(s3.upload(imageUrlObject));
        });
      }

      return Promise.all(promises);
    }).then(function(results) {
      oOGraph.image = results.filter(function(result) {
        return !(result instanceof Error);
      });
      return oOGraph.save();
    }).then(function(model) {
      oRes.status(201).send({
        status: 201,
        data: model.toJSON()
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
