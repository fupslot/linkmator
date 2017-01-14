'use strict';
require('dotenv').load();

const mediator = require('../worker/mediator');

mediator.publishEvent('user-create', {to: 'fdashlot@gmail.com'}, (error) => {
  error && console.log(error);
});
