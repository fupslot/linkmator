'use strict';
const mongoose = require('mongoose');
const requestUrlOpenGraph = require('request-url-open-graph');
const colors = require('colors/safe');
const util = require('util');
const Url = require('url');

const ImageObjectModel = require('../model/imageobject');
const OpenGraphModel = require('../model/opengraph');
const uploadImageToS3 = require('./S3ImageUploader');
const ImageUrlObject = require('./ImageUrlObject');
const debuglog = util.debuglog('lib/graph');

function fetchOpenGraphByURLFromWeb(url) {
  return new Promise((resolve, reject) => {
    function onRequest(error, graph) {
      if (error) {
        // Should be reported to a log system
        debuglog(colors.red(`request graph: ${error.message}`));
        return reject(error);
      }

      graph._id = new mongoose.Types.ObjectId();
      graph.hostname = Url.parse(graph.url).hostname;

      if (Array.isArray(graph.image)) {
        graph.image = graph.image.map((image) => new ImageUrlObject(image));
      }

      return resolve(graph);
    }

    requestUrlOpenGraph({ url }, onRequest);
  });
}

function validateOpenGraph(graph) {
  const model = new OpenGraphModel(graph);
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
  if (Array.isArray(graph.image)) {
    return Promise.all(
      graph.image.map(uploadImageToS3)
    ).then((images) => {
      graph.image = images.filter((obj) => !(obj instanceof Error));
      return graph;
    });
  } else {
    return Promise.resolve(graph);
  }
}

function saveOpenGraphToDB(graph) {
  const model = new OpenGraphModel(graph);
  const promises = [model.save()];

  if (Array.isArray(graph.image)) {
    promises.push(ImageObjectModel.create(graph.image));
  }

  return Promise.all(promises).then((results) => {
    const obj = results[0].toJSON();

    if (results[1]) {
      obj.image = results[1].map((m) => m.toJSON());
    }
    return obj;
  });
}

function fetchOpenGraphByURLFromDB(url) {
  const query = OpenGraphModel.findOne({url});
  query.select('-__v');
  query.populate('image', '-__v', 'ImageObject');
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
