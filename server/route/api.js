'use strict';
const express = require('express');
const requestUrlOpenGraph = require('request-url-open-graph');
const validator = require('validator');
// const oConfig = require('node-config-files')('./server/config');

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
      oRes.status(201).send({
        status: 201,
        data: oModel.toJSON()
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
