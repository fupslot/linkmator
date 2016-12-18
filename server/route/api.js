'use strict';
const express = require('express');
const requestUrlOpenGraph = require('request-url-open-graph');
const validator = require('validator');
const config = require('node-config-files')('./server/config');

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
      return oOGraph.save();
    }).then((oModel) => {
      if (Array.isArray(oModel.image)) {
        const s3 = require('../lib/s3-image-upload')({
          bucket: config.common.s3.bucket
        });

        const uploadImages = [oModel];

        for (var i = 0; i < oModel.image.length; i++) {
          uploadImages.push(s3.upload(oModel.image[i].url));
        }

        return Promise.all(uploadImages);
      } else {
        return oModel;
      }
    }).then(function(results) {
      if (Array.isArray(results)) {
        oRes.status(201).send({
          status: 201,
          data: results[0].toJSON()
        });
      } else {
        oRes.status(201).send({
          status: 201,
          data: results.toJSON()
        });
      }
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
