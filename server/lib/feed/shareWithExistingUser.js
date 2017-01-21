'use strict';
const Post = require('../../model/post.model');

module.exports = ({postId, postOwnerId, recipient}) => {
  return Post.findById(postId)
    .where('owner')
    .equals(postOwnerId)
    .exec()
    .then((post) => {
      if (!post) {
        return Promise.resolve();
      }

      const data = post.toJSON();
      delete data._id;
      data.owner = recipient;
      data.sharedBy = postOwnerId;
      data.sharedAt = new Date();

      return Post.create(data);
    });
};
