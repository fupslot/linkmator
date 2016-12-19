'use strict';
const util = require('util');
const EventEmitter = require('events');
const requestUrlOpenGraph = require('request-url-open-graph');
const OpenGraphModel = require('../model/ograph');
const ImageObjectModel = require('../model/imageobject');
const ImageUrlObject = require('./ImageUrlObject');
// const config = require('node-config-files')('./server/config');
const debuglog = util.debuglog('OpenGraph');
const colors = require('colors/safe');
const S3ImageUpload = require('../lib/S3ImageUpload');

class OpenGraph {
  constructor(openGraphObject) {
    this._ogo = openGraphObject;

    this._openGraphModel = null;
    this._imageUrlObjects = null;
    this._image = [];

    this._onOpenGraphRequest = this._onOpenGraphRequest.bind(this);
    this._onOpenGraphModelValidate = this._onOpenGraphModelValidate.bind(this);
    this._fetchImage = this._fetchImage.bind(this);
    this._saveImage = this._saveImage.bind(this);
    this._saveGraph = this._saveGraph.bind(this);
    this._findOpenGraph = this._findOpenGraph.bind(this);

    EventEmitter.call(this);
  }

  fetch() {
    return new Promise((resolve, reject) => {
      this.on('error', reject);
      this.on('invalid', reject);
      this.on('finish', resolve);

      this._findOpenGraph(this._ogo);
    });
  }

  _findOpenGraph({url}) {
    OpenGraphModel.findOne({url}, (error, doc) => {
      if (error) {
        this.emit('error', error);
        return;
      }

      if (doc) {
        this._openGraphModel = doc;
        this.emit('finish', this);
        return;
      }

      requestUrlOpenGraph(this._ogo, this._onOpenGraphRequest);
    });
  }

  _onOpenGraphRequest(error, graph) {
    if (error) {
      debuglog(colors.red(`request graph: ${error.message}`));
      this.emit('error', error);
      return;
    }

    const images = graph.image;
    delete graph.image;

    if (Array.isArray(images)) {
      for (var i = 0; i < images.length; i++) {
        debuglog(colors.green(`image: ${images[i]}`));
        this._image.push(
          new ImageUrlObject(images[i])
        );
      }
    }

    this._openGraphModel = new OpenGraphModel(graph);
    this._openGraphModel.validate(this._onOpenGraphModelValidate);
  }

  _onOpenGraphModelValidate(error) {
    if (error) {
      this.emit('invalid', error, this);
      return;
    }

    if (this._image.length > 0) {
      this._fetchImage();
    } else {
      this._saveGraph();
    }
  }

  _fetchImage() {
    const s3 = S3ImageUpload();
    const uploadImageToS3Tasks = [];

    for (var i = 0; i < this._image.length; i++) {
      uploadImageToS3Tasks.push(s3.upload(this._image[i]));
    }

    Promise.all(uploadImageToS3Tasks)
      .then((results) => {
        this._image = this._image.filter((o, i) => {
          if (!(results[i] instanceof Error)) {
            return true;
          } else {
            debuglog(colors.red(`upload url: ${o.url}`));
            debuglog(colors.red(`upload message: ${results[i].message}`));
            return false;
          }
        });

        if (this._image.length > 0) {
          this.emit('ImageResponse', this);
          this._saveImage();
        }
      });
  }

  _saveImage() {
    ImageObjectModel.create(this._image, (error, objects) => {
      if (error) {
        this.emit('error', error, this);
        return;
      }

      this._imageUrlObjects = objects;

      for (var i = 0; i < objects.length; i++) {
        this._openGraphModel.image.push(objects[i].id);
      }

      this.emit('ImageSave', this);
      this._saveGraph();
    });
  }

  _saveGraph() {
    this._openGraphModel.save((error, model) => {
      if (error) {
        this.emit('error', error, this);
        return;
      }

      this.emit('finish', this);
    });
  }
}

util.inherits(OpenGraph, EventEmitter);

module.exports = OpenGraph;
