'use strict';
const Person = require('../model/person');
// const OpenGraph = require('../model/opengraph');
const Feed = require('../model/feed');

function getPerson(id) {
  const query = Person.findById(id);
  query.select('-__v');
  return query.exec();
}

/**
 * getFeed - Returns a user's feed
 * @param  {String} userId User ID
 * @return {Object} Promise
 */
function getFeed(userId, options) {
  const query = Feed.find({creator: userId});
  query.select('-__v');

  if (options.type) {
    query.where('type').equals(options.type);
  }

  query.populate({
    path: 'creator',
    select: '-__v',
    model: 'Person'
  });

  query.populate({
    path: 'opengraph',
    select: '-__v',
    model: 'OpenGraph',
    populate: {
      path: 'image',
      select: ' -__v',
      model: 'ImageObject'
    }
  });

  query.sort({'createdAt': 'desc'});
  return query.exec();
}

module.exports = {
  getPerson,
  getFeed
};
