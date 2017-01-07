import React from 'react';
import classNames from 'classnames';

import SvgIcon from './SvgIcon';
import ImagePreloader from './ImagePreloader';
import ImageContainer from './ImageContainer';

class FeedArticle extends React.Component {
  renderFeedImage() {
    const model = this.props.model;

    // No image to render
    if (!Array.isArray(model.image) || !model.image[0]) {
      return null;
    }

    const image = model.image[0];

    return (
      <ImageContainer>
        {({width: cWidth, height: cHeight}) => {
          return (
            <ImagePreloader url={image.s3_object_key}>
              {({url, width: imgWidth, height: imgHeight}) => {
                const imageFitContaineer = (
                  imgWidth <= cWidth &&
                  imgHeight <= cHeight
                );
                const backgroundSize = imageFitContaineer ? 'initial' : 'cover';
                return (
                  <div
                    className="FeedArticle__image"
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundSize
                    }} />
                );
              }}
              </ImagePreloader>
          );
        }}
      </ImageContainer>
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
