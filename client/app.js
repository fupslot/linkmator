import React from 'react';
import ReactDOM from 'react-dom';

var __svg__ = {
  path: './svg/**/*.svg',
  name: 'sprite.[hash].svg'
};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

require('./sass/style.scss');

import AppLayout from './js/layout/AppLayout.js';

ReactDOM.render(
  <AppLayout />,
  document.getElementById('app')
);
