import React from 'react';
import ReactDOM from 'react-dom';

var __svg__ = {
  path: './svg/**/*.svg',
  name: 'sprite.[hash].svg'
};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);


const SayHello = () => {
  const onClick = () => {
    console.log('Hello');
  };

  return (
    <button onClick={onClick}>Hello</button>
  );
};

ReactDOM.render(
  <SayHello></SayHello>,
  document.getElementById('app')
);
