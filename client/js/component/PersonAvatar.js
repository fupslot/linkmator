import React from 'react';

class PersonAvatar extends React.Component {
  render() {
    return (
      <div className="PersonAvatar">
        <img className="PersonAvatar__image" src={this.props.gravatarUrl} />
        <div className="PersonAvatar__name">{this.props.fullName}</div>
      </div>
    );
  }
}

PersonAvatar.propTypes = {
  fullName: React.PropTypes.string,
  gravatarUrl: React.PropTypes.string
};

export default PersonAvatar;
