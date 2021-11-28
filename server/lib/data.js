'use strict';
const Person = require('../model/person');
// const OpenGraph = require('../model/opengraph');
// const Feed = require('../model/feed');
const Post = require('../model/post.model');

function getPerson(id) {
  const query = Person.findById(id);
  query.select('-__v');
  return query.exec();
}

function populatePost(query) {
  query.select('-__v');

  query.populate({
    path: 'owner',
    select: '-__v',
    model: 'Person'
  });

  query.populate({
    path: 'graph',
    select: '-__v',
    model: 'Graph'
  });

  return query;
}

/**
 * getPostByUserId - Returns a user posts
 * @param  {String} creator User ID
 * @return {Object} Promise
 */
function getPostsByUserId(uid, options) {
  const query = Post.find({owner: uid});

  query.populate({
    path: 'sharedBy',
    select: '-__v',
    model: 'Person'
  });

  query.populate({
    path: 'graph',
    select: '-__v',
    model: 'Graph'
  });

  query.select('-__v');

  const {type, timestamp} = options;

  type && query.where('type').equals(type);
  timestamp && query.where('createdAt').gte(timestamp);

  query.sort({'createdAt': 'desc'});
  return query.exec();
}

function getPostById(id, options) {
  options = Object.assign({_id: id}, options);
  return populatePost(Post.findOne(options)).exec();
}

module.exports = {
  getPerson,
  getPostsByUserId,
  getPostById
};
