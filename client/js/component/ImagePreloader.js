import React from 'react';

class ImagePreloader extends React.Component {
  constructor(props) {
    super(props);

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
    img.src = props.url;
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

export default ImagePreloader;
