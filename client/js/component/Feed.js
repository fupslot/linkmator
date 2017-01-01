import React from 'react';

class Feed extends React.Component {
  render() {
    return (
      <section className="Feed">
      { this.props.children }
      </section>
    );
  }
}
// FeedArticle
export default Feed;
