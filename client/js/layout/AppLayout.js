import React from 'react';
import TopBar from '../component/Topbar';
import Sidebar from '../component/Sidebar';
import Feed from '../component/Feed';

class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <TopBar />
        <main className="AppLayout">
          <Sidebar />
          <Feed />
        </main>
      </div>
    );
  }
}

export default AppLayout;
