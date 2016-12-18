'use strict';

const morgan = require('morgan');
const express = require('express');
const colors = require('colors/safe');

const app = express();

require('dotenv').config({silent: true});
const oConfig = require('node-config-files')('./server/config');

const {
  env: sEnv,
  port: nPort,
  hostname: sHostname
} = oConfig.common.server;

app.disable('x-powered-by');

require('./common/mongoose')(oConfig);

app.use(require('./middleware')(app, oConfig));

if (sEnv !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use(require('./route/api'));

app.on('stormpath.ready', function() {
  console.log('Stormpath: ready');
  app.listen(nPort, sHostname, () => {
    console.log(colors.green(`Listening port ${nPort} in "${sEnv}"`));
    app.emit('application.ready');
  });
});

module.exports = app;
