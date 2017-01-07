import React from 'react';
import { connect } from 'react-redux';
import { fetchFeed } from '../actions';
import FeedArticle from './FeedArticle';

export class Feed extends React.Component {
  componentWillMount() {
    this.props.fetchFeed();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.items);
  }

  renderFeedArticles() {
    if (!this.props.items) {
      return null;
    }

    return this.props.items.map((item, i) => {
      return (
        <FeedArticle
          key={item._id}
          model={item.opengraph} />
      );
    });
  }

  render() {
    return (
      <section className="Feed">
      { this.renderFeedArticles() }
      </section>
    );
  }
}

Feed.defaultProps = {
  items: null
};

Feed.propTypes = {
  items: React.PropTypes.array,
  fetchFeed: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    items: state.feed.items
  };
};

const FeedContainer = connect(
  mapStateToProps,
  {
    fetchFeed
  }
)(Feed);

// FeedArticle
export default FeedContainer;
