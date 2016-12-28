/* eslint-disable max-len */
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

// SEEDING...

OpenGraphModel.create(
  [
    {
      url: 'http://www.example.com',
      title: 'Example Domain'
    },
    {
      url: 'http://schema.org/',
      title: 'Home - schema.org',
      description: 'Schema.org is a set of extensible schemas that enables webmasters to embed\n    structured data on their web pages for use by search engines and other applications.'
    }
  ]
).then(() => {
  console.log(
    colors.yellow('OpenGraphModel - Seeded')
  );
}).catch((error) => {
  console.log(
    colors.red(`SeedingError - ${error.message}`)
  );
});
