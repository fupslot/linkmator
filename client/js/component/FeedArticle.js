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

  render() {
    return (
      <article className="FeedArticle">
        { this.renderFeedImage() }
        <header className="FeedArticle__header">
          <a className="FeedArticle__link" href="#" target="_blank">
            <h6 className="FeedArticle__title">
              React Universal with Next.js: Server-side React
            </h6>
            <p className="FeedArticle__description">
              The term ”universal” is a community-coined term for building web apps that render happily on a server. You might be familiar with ”isomorphic” as…
            </p>
            { this.renderFeedDomain() }
          </a>
        </header>
      </article>
    );
  }
}

export default FeedArticle;
