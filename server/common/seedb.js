'use strict';
const colors = require('colors/safe');
const OpenGraphModel = require('../model/opengraph');
const ImageObjectModel = require('../model/imageobject');
const PersonModel = require('../model/person');
const FeedModel = require('../model/feed');
const config = require('node-config-files')('./server/config');

console.log(colors.yellow(`Seeding DB: ${config.env.mongo.uri}`));

function handler(modelName) {
  return (error) => {
    console.log(
      colors.yellow(
        `Collection ${modelName}: ${!error ? 'dropped' : error.message}`
      )
    );
  };
}

OpenGraphModel.remove({}, handler('OpenGraphModel'));
ImageObjectModel.remove({}, handler('ImageObjectModel'));
PersonModel.remove({}, handler('PersonModel'));
FeedModel.remove({}, handler('FeedModel'));
