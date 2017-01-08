'use strict';
import React from 'react';

export class Topbar extends React.Component {
  render() {
    return (
      <div className="Topbar">
        <svg className="Logo">
          <use xlinkHref="#glyph-logo" />
        </svg>
        <form method="POST" action="/logout">
          <button>Leave</button>
        </form>
      </div>
    );
  }
}

export default Topbar;
