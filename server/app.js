'use strict';
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const stormpath = require('express-stormpath');
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


app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'jade');
app.disable('x-powered-by');

require('./common/mongoose')(config);

// Middleware
app.use(require('./middleware')(app, config));


if ('development' === env) {
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer();

  // Webpack Dev Server
  require('./common/static')(app, config);

  // Any requests to /static is proxied to Webpack Dev Server
  app.all('/static/*', (req, res) => {
    proxy.web(req, res, {
      target: `http://localhost:${config.common.server.webpack_server_port}`
    });
  });

  // It is important to catch any errors from the proxy or the
  // server will crash. An example of this is connecting to the
  // server when webpack is bundling
  proxy.on('error', function() {
    console.log(
      colors.red('Could not connect to proxy, please try again...')
    );
  });

  app.use(morgan('dev'));
} else {
  app.use(
    '/static',
    express.static(path.resolve(__dirname, '..', '.bin'))
  );
}

// Routes
app.use(require('./route/og'));
app.use(require('./route/feed'));

// Render
app.use('/app', stormpath.loginRequired, (req, res) => {
  res.render('app', {
    config: {
      env: config.common.server.env,
      hostname: config.common.server.hostname,
      port: config.common.server.port,
      cdnHost: config.common.server.cdnHost
    },
    assets: env === 'production' ? require('../webpack-assets.json') : null
  });
});

/// Root
app.use('/', function(req, res) {
  res.redirect('/login');
});

app.on('stormpath.ready', function() {
  app.listen(port, hostname, () => {
    console.log(colors.green(`S3 Bucket: ${config.common.s3.bucket}`));
    console.log(colors.green(`S3 Region: ${config.common.s3.region}`));

    console.log(colors.green(`Listening port ${port} in "${env}"`));
    app.emit('application.ready');
  });
});

module.exports = app;
