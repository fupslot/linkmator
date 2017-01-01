import React from 'react';
import TopBar from '../component/Topbar';
import Sidebar from '../component/Sidebar';
import Feed from '../component/Feed';
import FeedArticle from '../component/FeedArticle';

class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <TopBar />
        <main className="AppLayout">
          <Sidebar />
          <Feed>
            <FeedArticle />
          </Feed>
        </main>
      </div>
    );
  }
}

export default AppLayout;
