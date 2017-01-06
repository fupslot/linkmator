import React from 'react';

class ImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this.el = null;
  }

  componentDidMount() {
    const {width, height} = this.el;
    this.setState({width, height});
  }

  render() {
    return (
      <div
        ref={(el) => this.el = el}
        className="FeedArticle__image-container">
        { this.el && this.props.children(this.state) }
      </div>
    );
  }
}

ImageContainer.propTypes = {
  children: React.PropTypes.func.isRequired
};

export default ImageContainer;
