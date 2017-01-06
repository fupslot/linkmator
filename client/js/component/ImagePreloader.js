import React from 'react';

class ImagePreloader extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      url: null,
      width: 0,
      height: 0
    };

    const img = new Image();
    img.addEventListener(
      'load',
      this._imgEventHandler.bind(this, img)
    );

    const {cdnHost} = this.context.config;
    img.src = `${cdnHost}/${props.url}`;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.url !== nextState.url;
  }

  _imgEventHandler(img, {type}) {
    this.setState({
      url: img.src,
      width: img.width,
      height: img.height
    });
  }

  render() {
    if (!this.state.url) {
      return null;
    }

    return this.props.children(this.state);
  }
}

ImagePreloader.propTypes = {
  url: React.PropTypes.string.isRequired,
  children: React.PropTypes.func.isRequired
};

ImagePreloader.contextTypes = {
  config: React.PropTypes.object
};

export default ImagePreloader;
