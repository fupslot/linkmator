import React from 'react';
import { connect } from 'react-redux';

import { createOpenGraph, postGraphToFeed } from '../actions';
import FeedArticle from './FeedArticle';


export class Linkmator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.handleGraphSubmit = this.handleGraphSubmit.bind(this);
  }

  focusTextarea() {
    this.textarea.focus();
  }

  handleTextChange(event) {
    this.setState({text: event.currentTarget.value});
  }

  handleGraphSubmit(event) {
    event.preventDefault();

    this.props.postGraphToFeed(this.props.graph._id);
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
      <div>
        <form
          name="graphform"
          className="Linkmator__graphform"
          onSubmit={this.handleGraphSubmit}>
          <div className="Linkmator__graphfield">
            <label className="Linkmator__graphtitle">
              {this.props.graph.url}
            </label>
            <FeedArticle
              url={this.props.graph.url}
              title={this.props.graph.title}
              hostname={this.props.graph.hostname}
              description={this.props.graph.description} />
            <button className="Linkmator__button">Post</button>
          </div>
        </form>

      </div>
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
          disabled={this.props.isSaving}>Save</button>
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
  postGraphToFeed: React.PropTypes.func
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
    createOpenGraph
  }
)(Linkmator);
