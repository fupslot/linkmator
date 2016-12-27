'use strict';
const mongoose = require('mongoose');
const colors = require('colors/safe');

mongoose.Promise = global.Promise;

module.exports = (oConfig) => {
  const {
    uri: uri,
    options: options
  } = oConfig.env.mongo;

  mongoose.connect(uri, options, function(error) {
    if (error) {
      console.log(colors.red('Database: failed'));
      console.log(colors.red(`Database: ${error.message}`));
      process.exit(1);
    }

    console.log(colors.green('Database: ready'));
    console.log(colors.green(`Database: ${uri}`));

    if (oConfig.common.server.env === 'test') {
      require('./seedb');
    }
  });
};
