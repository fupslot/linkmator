import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './js/store';
import AppLayout from './js/layout/AppLayout';


var __svg__ = {
  path: './svg/**/*.svg',
  name: 'sprite.[hash].svg'
};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

require('./sass/style.scss');


ReactDOM.render(
  <Provider store={store}>
    <AppLayout />
  </Provider>,
  document.getElementById('app')
);
