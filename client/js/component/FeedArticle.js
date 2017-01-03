import React from 'react';
import SvgIcon from './SvgIcon';

class FeedArticle extends React.Component {
  renderFeedImage() {
    return null;
    // return (
    //   <section className="FeedArticle__image">Image</section>
    // );
  }

  renderFeedDomain() {
    return (
      <p className="FeedArticle__domain">
        <SvgIcon glyph="globe" size="small" />
        <span>scotch.io</span>
      </p>
    );
  }

  renderFeedActions() {
    return (
      <div className="FeedArticle__actions">
        <button className="IconButton">
          <SvgIcon glyph="share" size="normal" />
        </button>
      </div>
    );
  }

  render() {
    return (
      <article className="FeedArticle">
        { this.renderFeedImage() }
        <header className="FeedArticle__header">
          <a className="FeedArticle__link" href={this.props.url} target="_blank">
            <h6 className="FeedArticle__title">
              { this.props.title }
            </h6>
            <p className="FeedArticle__description">
              { this.props.description}
            </p>
            { this.renderFeedDomain() }
          </a>
        </header>
        { this.renderFeedActions() }
      </article>
    );
  }
}

FeedArticle.propTypes = {
  url: React.PropTypes.string,
  title: React.PropTypes.string,
  description: React.PropTypes.string
};

export default FeedArticle;
