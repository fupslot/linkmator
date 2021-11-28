'use strict';
const express = require('express');
const validator = require('validator');

// const libGraph = require('../lib/graph');
// const util = require('../util');
const lib = require('../lib');

const router = express.Router();

/**
 * GET /api/friends
 * See https://github.com/fupslot/linkmator/wiki/api.friends
 */
router.get('/api/friends', function(req, res) {
  let query = req.query.query || '';
  const UID = req.getUID();

  query = validator.escape(query);
  query = validator.trim(query);

  lib.friends.fetchFriendList({UID, query})
    .then((friends) => {
      const STATUS = 200;

      return res.status(STATUS).json({
        status: STATUS,
        data: {
          friends: friends
        }
      });
    })
    .catch(res.sendServerError);
});

// For development only
const env = process.env.NODE_ENV;

if (env !== 'production') {
  router.post('/api/friends', function(req, res) {
    const {inviteeId} = req.body;
    const UID = req.getUID();

    lib.friends
      .addAsFriendById(UID, inviteeId)
      .then(() => {
        const STATUS = 200;

        res.status(200).json({
          status: STATUS
        });
      }).catch(res.sendServerError);
  });
}

module.exports = router;
