import React from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions';
import FeedArticle from './FeedArticle';

export class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.handlePostRemove = this.handlePostRemove.bind(this);
  }

  componentWillMount() {
    this.props.fetchPosts();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.items);
  }

  handlePostRemove(postModel) {
    console.log(postModel);
  }

  renderFeedArticles() {
    if (!this.props.posts) {
      return null;
    }

    return this.props.posts.map((item, i) => {
      return (
        <FeedArticle
          key={item._id}
          model={item.graph}
          onRemove={this.handlePostRemove}/>
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
  posts: null
};

Feed.propTypes = {
  posts: React.PropTypes.array,
  fetchPosts: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    posts: state.feed.posts
  };
};

const FeedContainer = connect(
  mapStateToProps,
  {
    fetchPosts
  }
)(Feed);

// FeedArticle
export default FeedContainer;
