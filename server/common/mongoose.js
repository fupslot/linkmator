'use strict';
const mongoose = require('mongoose');
const colors = require('colors/safe');

mongoose.Promise = global.Promise;

module.exports = (oConfig) => {
  const {
    uri: sUri,
    options: oOptions
  } = oConfig.env.mongo;

  mongoose.connect(sUri, oOptions, function(oError) {
    if (oError) {
      console.log(colors.red('Database: failed'));
      console.log(colors.red(`Database: ${oError.message}`));
      process.exit(1);
    }

    console.log(colors.green('Database: ready'));
    console.log(colors.green(`Database: ${sUri}`));

    if (oConfig.common.server.env === 'test') {
      require('../dropdb');
    }
  });
};
