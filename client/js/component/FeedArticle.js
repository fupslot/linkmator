import React from 'react';

/// material-ui
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';

import SvgIcon from './SvgIcon';
import ImagePreloader from './ImagePreloader';
import ImageContainer from './ImageContainer';
import toDateString from '../util/toDateString';

const TOP_MENU_ITEM_REMOVE = 0x1;
const TOP_MENU_ITEM_SHARE = 0x2;

class FeedArticle extends React.Component {
  constructor(props) {
    super(props);

    this.handleMenuItemTouch = this.handleMenuItemTouch.bind(this);
  }

  handleMenuItemTouch(evt, child) {
    const { value } = child.props;
    switch (value) {
      /// Remove
      case TOP_MENU_ITEM_REMOVE:
        this.props.onRemove(this.props.model);
        return;
      case TOP_MENU_ITEM_SHARE:
        this.props.onShare(this.props.model);
    }
  }

  renderFeedImage() {
    const model = this.props.model;

    // No image to render
    if (!model.image) {
      return null;
    }

    const image = model.image;

    return (
      <ImageContainer>
        {({width: cWidth, height: cHeight}) => {
          return (
            <ImagePreloader url={image.s3Key}>
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

  renderTop() {
    return (
      <div className="FeedArticle__top">
        <span className="FeedArticle__date">
          {toDateString(this.props.model.createdAt)}
        </span>
        <IconMenu
          onItemTouchTap={this.handleMenuItemTouch}
          iconButtonElement={
            <IconButton>
              <SvgIcon glyph="more-vert" />
            </IconButton>
          }
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
          <MenuItem primaryText="Share..." value={TOP_MENU_ITEM_SHARE} />
          <Divider />
          <MenuItem primaryText="Remove" value={TOP_MENU_ITEM_REMOVE} />
        </IconMenu>
      </div>
    );
  }

  render() {
    const model = this.props.model;

    return (
      <Paper zDepth={1}>
        { this.renderTop() }
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
      </Paper>
    );
  }
}

FeedArticle.propTypes = {
  model: React.PropTypes.object,
  className: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  onShare: React.PropTypes.func
};

export default FeedArticle;
