'use strict';
import React from 'react';

class Topbar extends React.Component {
  render() {
    return (
      <div className="Topbar">
        <svg className="Logo">
          <use xlinkHref="#glyph-logo" />
        </svg>
      </div>
    );
  }
}

export default Topbar;
