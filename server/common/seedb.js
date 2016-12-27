'use strict';
const colors = require('colors/safe');
const OpenGraphModel = require('../model/opengraph');
const ImageObjectModel = require('../model/imageobject');
const config = require('node-config-files')('./server/config');

console.log(colors.yellow(`Seeding DB: ${config.env.mongo.uri}`));

OpenGraphModel.remove({}, function(error) {
  console.log(
    colors.yellow(`Collection OpenGraph: ${!error ? 'dropped' : error.message}`)
  );
});

ImageObjectModel.remove({}, function(error) {
  console.log(
    colors.yellow(`Collection ImageObject: ${!error ? 'dropped' : error.message}`)
  );
});
