'use strict';
const express = require('express');
const router = express.Router();
const validator = require('validator');
// const OpenGraph = require('../model/opengraph');
const GraphModel = require('../model/graph.model');
// const Feed = require('../model/feed');
const Post = require('../model/post.model');
const ValidationError = require('mongoose/lib/error/validation');
const libData = require('../lib/data');
const { isFeedType } = require('../lib/validate');

/**
 * POST /api/post
 * https://github.com/fupslot/linkmator/wiki/API
 */
router.post('/api/posts', (req, res) => {
  const data = req.body;

  if (!validator.isMongoId(data.graphId)) {
    return res.sendRequestError(
      new Error('"graphId" is not valid')
    );
  }

  const UID = req.getUID();
  const graphId = data.graphId;

  return GraphModel.findById(graphId)
    .then((graph) => {
      if (!graph) {
        return Promise.reject(
          new Error(`graphId ${data.graphId} not found`)
        );
      }

      return Post.create({
        owner: UID,
        graph: graph.id
      });
    })
    .then((post) => libData.getPostById(post._id, {owner: UID}))
    .then((post) => {
      const STATUS = 201;
      res.status(STATUS).json({
        status: STATUS,
        data: {
          post: post.toJSON()
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
router.get('/api/posts', function(req, res) {
  const UID = req.getUID();

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
    libData.getPerson(UID),
    libData.getPostsByUserId(UID, {type, timestamp})
  ]).then((models) => {
    const STATUS = 200;
    res.status(STATUS).json({
      status: STATUS,
      data: {
        person: models[0],
        posts: models[1],
        timestamp: Date.now()
      }
    });
  }).catch(res.sendServerError);
});

router.delete('/api/posts', function(req, res) {
  const {id} = req.query;

  if (!id || !validator.isMongoId(id)) {
    return res.sendRequestError(
      new Error('"id" is invalid')
    );
  }

  return Post.findByIdAndRemove(id)
    .where('creator').equals(req.getUID())
    .then(() => {
      const STATUS = 200;
      res.status(STATUS).json({
        status: STATUS,
        data: {}
      });
    })
    .catch(res.sendServerError);
});

module.exports = router;
