import React from 'react';

class PersonAvatar extends React.Component {
  render() {
    return (
      <div className="PersonAvatar">
        <div className="PersonAvatar__name">{this.props.fullName}</div>
      </div>
    );
  }
}

PersonAvatar.propTypes = {
  fullName: React.PropTypes.string,
  email: React.PropTypes.string
};

export default PersonAvatar;
