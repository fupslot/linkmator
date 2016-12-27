'use strict';
const colors = require('colors/safe');
const OpenGraphModel = require('../model/opengraph');
const ImageObjectModel = require('../model/imageobject');
const PersonModel = require('../model/person');
const config = require('node-config-files')('./server/config');

console.log(colors.yellow(`Seeding DB: ${config.env.mongo.uri}`));

function statusReport(modelName) {
  return (error) => {
    console.log(
      colors.yellow(
        `Collection ${modelName}: ${!error ? 'dropped' : error.message}`
      )
    );
  };
}

OpenGraphModel.remove({}, statusReport('OpenGraphModel'));
ImageObjectModel.remove({}, statusReport('ImageObjectModel'));
PersonModel.remove({}, statusReport('PersonModel'));
