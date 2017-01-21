'use strict';
const mongoose = require('mongoose');
const requestUrlOpenGraph = require('request-url-open-graph');
const colors = require('colors/safe');
const Url = require('url');
const pick = require('lodash.pick');

// const ImageObjectModel = require('../model/imageobject');
// const OpenGraphModel = require('../model/opengraph');
const util = require('../util');
const GraphModel = require('../model/graph.model');
const uploadImageToS3 = require('./S3ImageUploader');

/**
 * Creates an image object
 * @param  {string} imageUrl Image URL
 * @return {object}          Image object
 */
function createImageObject(obj) {
  if (typeof obj !== 'object') {
    console.log(`GRAPH | Expected an object and got ${typeof obj}`);
    return null;
  }

  const config = require('node-config-files')('./server/config');

  // When an image URL has no protocol specified,
  // use https: as a default
  const originalUrl = obj.url.startsWith('//') ? `https:${obj.url}` : obj.url;

  const originalUrlHash = util.getStringHash(originalUrl);
  const parsedUrl = Url.parse(originalUrl);
  const s3Bucket = config.common.s3.bucket;
  const s3Key = `${config.common.s3.objectKey}/${parsedUrl.hostname}/${originalUrlHash}`;

  const imageObject = {
    originalUrl,
    originalUrlHash,
    s3Bucket,
    s3Key,
    protocol: parsedUrl.protocol.substr(0, parsedUrl.protocol.length - 1)
  };

  return imageObject;
}

function fetchOpenGraphByURLFromWeb(url) {
  return new Promise((resolve, reject) => {
    function onRequest(error, graph) {
      if (error) {
        // Should be reported to a log system
        console.log(colors.red(`request graph: ${error.message}`));
        return reject(error);
      }

      const graphAttrs = [
        'url',
        'title',
        'description',
        'site',
        'type',
      ];

      const graphObject = pick(graph, graphAttrs);
      graphObject._id = new mongoose.Types.ObjectId();
      graphObject.hostname = Url.parse(graph.url).hostname;

      if (Array.isArray(graph.image)) {
        graphObject.image = createImageObject(graph.image[0]);
      }

      return resolve(graphObject);
    }

    requestUrlOpenGraph({ url }, onRequest);
  });
}

function validateOpenGraph(graph) {
  const model = new GraphModel(graph);
  return new Promise((resolve, reject) => {
    function onValidate(error) {
      if (error) {
        return reject(error);
      }
      return resolve(graph);
    }
    model.validate(onValidate);
  });
}

function uploadImagesToS3(graph) {
  if (typeof graph.image === 'object') {
    return uploadImageToS3(graph.image)
      .then((obj) => {
        if (obj instanceof Error) {
          console.log(`S3 UPLOAD | ${obj.message}`);
          graph.image = null;
        }
        return graph;
      });
  } else {
    return Promise.resolve(graph);
  }
}

function saveOpenGraphToDB(graph) {
  const graphModel = new GraphModel(graph);
  return graphModel.save();
  // const promises = [model.save()];

  // if (Array.isArray(graph.image)) {
  //   promises.push(ImageObjectModel.create(graph.image));
  // }

  // return Promise.all(promises).then((results) => {
  //   const obj = results[0].toJSON();
  //
  //   if (results[1]) {
  //     obj.image = results[1].map((m) => m.toJSON());
  //   }
  //   return obj;
  // });
}

function fetchOpenGraphByURLFromDB(url) {
  const query = GraphModel.findOne({url});
  query.select('-__v');
  return query.exec();
}

// function saveOpenGraphToDB(graph) {
//   return fetchOpenGraphByURLFromWeb(url)
//    .then(validateOpenGraph)
//    .then(uploadImagesToS3)
//    .then(saveOpenGraphToDB)
// }

module.exports = {
  // getStringHash,
  uploadImageToS3,
  validateOpenGraph,
  fetchOpenGraphByURLFromWeb,
  uploadImagesToS3,
  saveOpenGraphToDB,
  fetchOpenGraphByURLFromDB
};
