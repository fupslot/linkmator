'use strict';
const express = require('express');
const validator = require('validator');

// const OpenGraphObject = require('../lib/OpenGraphObject');
// const OpenGraph = require('../lib/OpenGraph');
const libGraph = require('../lib/graph');

const router = express.Router();

/**
 * POST /api/get
 */
router.post('/api/og', function(req, res) {
  const data = req.body;
  const url = data.url || '';

  if (!validator.isURL(url)) {
    return res.sendModelValidationError({
      errors: {
        url: {
          path: 'url',
          message: '"url" must be valid',
          value: url
        }
      }
    });
  }

  libGraph.fetchOpenGraphByURLFromDB(url).then((model) => {
    if (model) {
      return res.status(200).json({
        status: 200,
        data: model.toJSON()
      });
    }

    return libGraph.fetchOpenGraphByURLFromWeb(url)
      .then(libGraph.validateOpenGraph)
      .then(libGraph.uploadImagesToS3)
      .then(libGraph.saveOpenGraphToDB)
      .then((graph) => {
        return libGraph.fetchOpenGraphByURLFromDB(graph.url);
      })
      .then((graph) => {
        res.status(201).json({
          status: 201,
          data: graph
        });
      });

  }).catch((error) => {
    if (error.name === 'ValidationError') {
      res.sendModelValidationError(error);
    } else {
      // Note: should be reported to a log system
      console.log(error);
      res.sendServerError(error);
    }
  });
});

module.exports = router;
