import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reactTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import store from './js/store';
import ConfigProvider from './js/component/ConfigProvider';
import AppLayout from './js/layout/AppLayout';
import mainTheme from './js/theme/main';


/// Needed for onTouchTap.
/// See: http://stackoverflow.com/a/34015469/988941
reactTapEventPlugin();


var __svg__ = {
  path: './svg/**/*.svg',
  name: 'sprite.[hash].svg'
};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

/// Sass
require('./sass/style.scss');


ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={mainTheme}>
      <ConfigProvider>
        <AppLayout />
      </ConfigProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);
