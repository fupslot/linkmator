import React from 'react';
import { connect } from 'react-redux';

import {
  createOpenGraph,
  postGraphToFeed,
  postGraphReset
} from '../actions';
import FeedArticle from './FeedArticle';
import FeedPoster from './FeedPoster';


export class Linkmator extends React.Component {
  constructor(props) {
    super(props);

    this.state = { text: '' };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.handleGraphSubmit = this.handleGraphSubmit.bind(this);
    this.handleGraphReset = this.handleGraphReset.bind(this);
  }

  focusTextarea() {
    this.textarea.focus();
  }

  handleTextChange(event) {
    this.setState({text: event.currentTarget.value});
  }

  handleGraphSubmit(graph) {
    this.props.postGraphToFeed(graph._id);
    this.clearText();
  }

  handleGraphReset() {
    this.props.postGraphReset();
    this.clearText();
  }

  clearText() {
    this.setState({ text: ''});
  }

  handleTextSubmit(event) {
    event.preventDefault();

    if (this.state.text.length === 0) {
      this.focusTextarea();
    } else {
      this.props.createOpenGraph(this.state.text);
    }

  }

  renderGraph() {
    if (!this.props.graph) {
      return null;
    }

    return (
      <FeedPoster
        graph={this.props.graph}
        onSubmit={this.handleGraphSubmit}
        onReset={this.handleGraphReset}>
        <FeedArticle
          className="FeedPoster__article"
          model={this.props.graph} />
      </FeedPoster>
    );
  }

  renderForm() {
    if (this.props.graph) {
      return null;
    }

    return (
      <form
        className="Linkmator__form"
        onSubmit={this.handleTextSubmit}>
        <textarea
          name="text"
          className="Linkmator__input"
          ref={(el) => this.textarea = el}
          cols={4}
          disabled={this.props.isSaving}
          value={this.state.text}
          onChange={this.handleTextChange} />
        <button
          className="Linkmator__button"
          disabled={this.props.isSaving}>Post</button>
      </form>
    );
  }

  render() {
    return (
      <div className="Linkmator">
        { this.renderForm() }
        { this.renderGraph() }
      </div>
    );
  }
}

Linkmator.propTypes = {
  isSaving: React.PropTypes.bool,
  url: React.PropTypes.string,
  graph: React.PropTypes.object,
  createOpenGraph: React.PropTypes.func,
  postGraphToFeed: React.PropTypes.func,
  postGraphReset: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    isSaving: state.linkmator.isSaving,
    url: state.linkmator.url,
    graph: state.linkmator.graph
  };
};

export default connect(
  mapStateToProps,
  {
    postGraphToFeed,
    createOpenGraph,
    postGraphReset
  }
)(Linkmator);
