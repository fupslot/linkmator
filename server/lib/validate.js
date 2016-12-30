'use strict';

const FEED_TYPES = [
  'PUBLIC',
  'PRIVATE'
];

const isFeedType = (value) => {
  return FEED_TYPES.includes(value);
};

module.exports = {
  isFeedType
};
