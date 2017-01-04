import React from 'react';
import TopBar from '../component/Topbar';
import Sidebar from '../component/Sidebar';
import Feed from '../component/Feed';
import Linkmator from '../component/Linkmator';

class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <TopBar />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-lg-3">
              <Sidebar />
            </div>
            <div className="col-xs-12 col-lg-6">
              <Linkmator />
              <Feed />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppLayout;
