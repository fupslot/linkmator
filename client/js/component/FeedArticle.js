import React from 'react';
import classNames from 'classnames';

import SvgIcon from './SvgIcon';
import ImagePreloader from './ImagePreloader';

class FeedArticle extends React.Component {
  renderFeedImage() {
    const model = this.props.model;

    // No image to render
    if (!Array.isArray(model.image) || !model.image[0]) {
      return null;
    }

    const image = model.image[0];

    return (
      <ImagePreloader url={image.s3_object_key}>
        {({url}) => {
          return (
            <div className="FeedArticle__image-container">
              <img className="FeedArticle__image" src={url} />
            </div>
          );
        }}
      </ImagePreloader>
    );
  }

  render() {
    const cx = classNames('FeedArticle', this.props.className);
    const model = this.props.model;

    return (
      <article className={cx}>
        { this.renderFeedImage() }
        <header className="FeedArticle__header">
          <a className="FeedArticle__link" href={model.url} target="_blank">
            <h6 className="FeedArticle__title">
              { model.title }
            </h6>
            <p className="FeedArticle__description">
              { model.description}
            </p>
            <p className="FeedArticle__domain">
              <SvgIcon glyph="globe" size="small" />
              <span>{model.hostname}</span>
            </p>
          </a>
        </header>
        <div className="FeedArticle__actions">
          <button className="IconButton">
            <SvgIcon glyph="share" size="normal" />
          </button>
        </div>
      </article>
    );
  }
}

FeedArticle.propTypes = {
  model: React.PropTypes.object,
  className: React.PropTypes.string
};

export default FeedArticle;
