/* eslint-disable max-len */
'use strict';
const colors = require('colors/safe');
const OpenGraphModel = require('../model/opengraph');
const GraphModel = require('../model/graph.model');
const ImageObjectModel = require('../model/imageobject');
const PersonModel = require('../model/person');
const FeedModel = require('../model/feed');
const config = require('node-config-files')('./server/config');


const {
  SEED_GRAPH_EXAMPLE_COM,
  SEED_GRAPH_SCHEMA_ORG
} = require('./seedefs');


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
GraphModel.remove({}, handler('GraphModel'));
ImageObjectModel.remove({}, handler('ImageObjectModel'));
PersonModel.remove({}, handler('PersonModel'));
FeedModel.remove({}, handler('FeedModel'));

// SEEDING...

OpenGraphModel.create(
  [
    {
      url: SEED_GRAPH_EXAMPLE_COM,
      title: 'Example Domain',
      hostname: 'example.com'
    },
    {
      url: SEED_GRAPH_SCHEMA_ORG,
      title: 'Home - schema.org',
      hostname: 'schema.org',
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
