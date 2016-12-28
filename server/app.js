'use strict';

const morgan = require('morgan');
const express = require('express');
const colors = require('colors/safe');

const app = express();

require('dotenv').config({
  silent: true
});

const config = require('node-config-files')('./server/config');
app.set('appConfig', config);

const {
  env,
  port,
  hostname
} = config.common.server;

app.disable('x-powered-by');

require('./common/mongoose')(config);

app.use(require('./middleware')(app, config));

if (env !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use(require('./route/og'));

app.on('stormpath.ready', function() {
  app.listen(port, hostname, () => {
    console.log(colors.green(`S3 Bucket: ${config.common.s3.bucket}`));
    console.log(colors.green(`S3 Region: ${config.common.s3.region}`));

    console.log(colors.green(`Listening port ${port} in "${env}"`));
    app.emit('application.ready');
  });
});

module.exports = app;
