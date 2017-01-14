'use strict';
const express = require('express');
const router = express.Router();
const validator = require('validator');

const shareFeedWithExistingUser = require('../lib/feed/shareWithExistingUser');
const shareFeedWithNotExistingUser = require('../lib/feed/shareWithNotExistingUser');

router.post('/api/share', (req, res) => {
  if (!req.body.data) {
    return res.sendRequestError(new Error('data not found'));
  }

  const {feedId, recipients} = req.body.data;

  if (!validator.isMongoId(feedId)) {
    return res.sendRequestError(new Error('feedId isn\'t valid'));
  }

  if (!Array.isArray(recipients)) {
    return res.sendRequestError(new Error('recipients are required'));
  }

  if (recipients.length === 0) {
    return res.sendRequestError(new Error('no valid recipients were found'));
  }

  if (recipients.length >= 5) {
    return res.sendRequestError(
      new Error('recipients list is to long, max 5 is allowed')
    );
  }

  const tasks = [];
  recipients.forEach((recipient) => {
    if (validator.isMongoId(recipient)) {
      tasks.push(shareFeedWithExistingUser({
        feedId,
        feedOwnerId: req.getUID(),
        recipient
      }));
    } else if (validator.isEmail(recipient)) {
      tasks.push(shareFeedWithNotExistingUser({
        feedId,
        feedOwnerId: req.getUID(),
        recipient
      }));
    }
  });

  return Promise.all(tasks).then(() => {
    const STATUS = 200;
    res.status(STATUS).json({
      status: STATUS
    });
  }).catch(res.sendServerError);

});

module.exports = router;
