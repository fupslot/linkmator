'use strict';
const express = require('express');
const validator = require('validator');
const router = express.Router();
const OpenGraphObject = require('../lib/OpenGraphObject');
const OpenGraph = require('../lib/OpenGraph');

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

  const openGraph = new OpenGraph(new OpenGraphObject({url}));

  function handleErrorResponse(error) {
    if (error.name === 'ValidationError') {
      oRes.sendValidationModelError(error);
    } else {
      oRes.sendServerError(error);
    }
  }

  function handleSuccessResponse(graph) {
    oRes.status(201).send({
      status: 201,
      data: graph._openGraphModel.toJSON()
    });
  }

  openGraph.on('finish', handleSuccessResponse);
  openGraph.on('error', handleErrorResponse);
  openGraph.on('invalid', handleErrorResponse);

  openGraph.fetch();
});

module.exports = router;
