'use strict';
const express = require('express');
const validator = require('validator');


const libGraph = require('../lib/graph');
const util = require('../util');

const router = express.Router();

/**
 * POST /api/graph
 */
router.post('/api/graph', function(req, res) {
  const data = req.body;
  let url = data.url || '';

  try {
    url = validator.trim(url);
  } catch (error) {
    return res.sendModelValidationError(
      'url',
      'url must be valid',
      url
    );
  }

  if (!validator.isURL(url)) {
    return res.sendModelValidationError(
      'url',
      'url must be valid',
      validator.escape(url)
    );
  }

  return libGraph.fetchOpenGraphByURLFromDB(url).then((model) => {
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
