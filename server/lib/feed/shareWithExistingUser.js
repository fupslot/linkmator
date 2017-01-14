'use strict';
const Feed = require('../../model/feed');

module.exports = ({feedId, feedOwnerId, recipient}) => {
  return Feed.findById(feedId)
    .where('creator')
    .equals(feedOwnerId)
    .exec()
    .then((feed) => {
      if (!feed) {
        return Promise.resolve();
      }

      const data = feed.toJSON();
      delete data._id;
      data.creator = recipient;
      data.sharedBy = feedOwnerId;
      data.sharedAt = new Date();

      return Feed.create(data);
    });
};
