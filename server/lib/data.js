'use strict';
const Person = require('../model/person');
// const OpenGraph = require('../model/opengraph');
const Feed = require('../model/feed');

function getPerson(id) {
  const query = Person.findById(id);
  query.select('-__v');
  return query.exec();
}

function populateFeed(query) {
  query.select('-__v');

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

  return query;
}

/**
 * getFeed - Returns a user's feed
 * @param  {String} creator User ID
 * @return {Object} Promise
 */
function getFeed(creator, options) {
  const query = populateFeed(Feed.find({creator}));
  query.select('-__v');

  const {type, timestamp} = options;

  type && query.where('type').equals(type);
  timestamp && query.where('createdAt').gte(timestamp);

  query.sort({'createdAt': 'desc'});
  return query.exec();
}

function getFeedById(creator, id) {
  const query = populateFeed(Feed.findOne({
    _id: id,
    creator
  }));
  return query.exec();
}

module.exports = {
  getPerson,
  getFeed,
  getFeedById
};
