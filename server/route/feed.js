'use strict';
const express = require('express');
const router = express.Router();
const validator = require('validator');
const OpenGraph = require('../model/opengraph');
const Feed = require('../model/feed');
const ValidationError = require('mongoose/lib/error/validation');
const libData = require('../lib/data');
const { isFeedType } = require('../lib/validate');

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

  const creatorId = req.user.customData.mongoId;

  OpenGraph.findById(data.open_graph_id)
    .then((graph) => {
      if (!graph) {
        return Promise.reject(
          new Error(`graph ${data.open_graph_id} not found`)
        );
      }

      const feedData = {
        creator: creatorId,
        type: data.type,
        opengraph: graph.id
      };

      return Feed.create(feedData);
    })
    .then((model) => libData.getFeedById(creatorId, model._id))
    .then((feed) => {
      const STATUS = 201;
      res.status(STATUS).json({
        status: STATUS,
        data: {
          feed: feed.toJSON()
        }
      });
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        res.sendModelValidationError(error);
      } else {
        // Note: should be reported to a log system
        res.sendServerError(error);
      }
    });
});

/// https://github.com/fupslot/linkmator/wiki/API
router.get('/api/feed', function(req, res) {
  const currentUserId = req.user.customData.mongoId;

  const {type, t} = req.query;
  let timestamp = null;

  if (type && !isFeedType(type)) {
    return res.sendRequestError(
      new Error('Invalid feed type value')
    );
  }

  if (t) {
    timestamp = new Date(Number(t));
    if (isNaN(timestamp.getTime())) {
      return res.sendRequestError(
        new Error('"t" must be a valid date')
      );
    }
  }

  return Promise.all([
    libData.getPerson(currentUserId),
    libData.getFeed(currentUserId, {type, timestamp})
  ]).then((models) => {
    const STATUS = 200;
    res.status(STATUS).json({
      status: STATUS,
      data: {
        person: models[0],
        feed: models[1],
        timestamp: Date.now()
      }
    });
  }).catch(res.sendServerError);
});

module.exports = router;
