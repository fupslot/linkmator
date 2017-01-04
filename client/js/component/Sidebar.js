import React from 'react';
import { connect } from 'react-redux';

import PersonAvatar from './PersonAvatar';

class Sidebar extends React.Component {
  renderPersonAvatar() {
    if (!this.props.person) {
      return null;
    }

    const person = this.props.person;
    const fullName = `${person.givenName} ${person.surname}`;

    return (
      <PersonAvatar
        fullName={fullName}
        gravatarUrl={person.gravatarUrl} />
    );
  }

  render() {
    return (
      <section className="Sidebar">
        { this.renderPersonAvatar() }
      </section>
    );
  }
}

Sidebar.propTypes = {
  person: React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    person: state.feed.person
  };
};

export default connect(
  mapStateToProps,
  {}
)(Sidebar);
