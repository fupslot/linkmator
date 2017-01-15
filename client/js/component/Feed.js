import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

import { fetchPosts } from '../actions';

import FeedArticle from './FeedArticle';


export class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharePost: null,
      showShareDialog: false
    };

    this.handlePostRemove = this.handlePostRemove.bind(this);
    this.handlePostShare = this.handlePostShare.bind(this);
    this.handleCloseShareDialog = this.handleCloseShareDialog.bind(this);
    this.handleSubmitShareDialog = this.handleSubmitShareDialog.bind(this);

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

  handlePostShare(postModel) {
    this.setState({
      sharePost: postModel,
      showShareDialog: true
    });
  }

  handleCloseShareDialog() {
    this.setState({
      sharePost: null,
      showShareDialog: false
    });
  }

  handleSubmitShareDialog(recipients) {
    console.log(recipients);
    this.handleCloseShareDialog();
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
          onRemove={this.handlePostRemove}
          onShare={this.handlePostShare} />
      );
    });
  }

  renderRecipientList() {
    return (
      <List>
        <ListItem
          primaryText="Chelsea Otakan"

          leftCheckbox={ <Checkbox /> }
        />
      </List>
    );
  }

  render() {
    const dialogActions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleCloseShareDialog}
      />,
      <FlatButton
        label="Share"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmitShareDialog}
      />
    ];

    return (
      <section className="Feed">
        <Dialog
          title="Share with friends"
          actions={dialogActions}
          modal={false}
          open={this.state.showShareDialog}
          onRequestClose={this.handleCloseShareDialog}
          autoScrollBodyContent={true}
        >
          <TextField
            fullWidth={true}
            floatingLabelText="Type name or email"
          />
          { this.renderRecipientList() }
        </Dialog>
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
