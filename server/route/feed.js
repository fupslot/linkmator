'use strict';
const express = require('express');
const router = express.Router();
const validator = require('validator');
const OpenGraph = require('../model/opengraph');
const Feed = require('../model/feed');
const ValidationError = require('mongoose/lib/error/validation');

/**
 * POST /api/feed
 * {
 *   data: {
 *     ogid: '<openg graph id>'
 *   }
 * }
 */
router.post('/api/feed', (req, res) => {
  const data = req.body.data;

  if (!data) {
    return res.sendRequestError(
      new Error('"data" is not found')
    );
  }

  if (!validator.isMongoId(data.open_graph_id)) {
    return res.sendRequestError(
      new Error('"open_graph_id" is not valid')
    );
  }

  OpenGraph.findById(data.open_graph_id).then((graph) => {
    if (!graph) {
      return Promise.reject(
        new Error(`graph ${data.open_graph_id} not found`)
      );
    }

    const feedData = {
      creator: req.user.customData.mongoId,
      type: data.type,
      opengraph: graph.id
    };

    return Feed.create(feedData);
  }).then((feed) => {
    const STATUS = 201;
    res.status(STATUS).json({
      status: STATUS,
      data: {
        feed_id: feed.id
      }
    });
  }).catch((error) => {
    if (error instanceof ValidationError) {
      res.sendModelValidationError(error);
    } else {
      // Note: should be reported to a log system
      res.sendServerError(error);
    }
  });

});

module.exports = router;
