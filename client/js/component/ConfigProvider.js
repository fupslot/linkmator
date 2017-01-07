import React from 'react';

class ConfigProvider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { config: null };
  }

  getChildContext() {
    return {
      config: this.state.config
    };
  }

  componentDidMount() {
    const config = document.getElementById('config');
    try {
      this.setState({
        config: JSON.parse(config.value)
      });
    } catch (error) {
      config.error('Can\'t read config string');
    }
  }

  render() {
    if (!this.state.config) {
      return null;
    }
    return this.props.children;
  }
}

ConfigProvider.childContextTypes = {
  config: React.PropTypes.object
};

ConfigProvider.propTypes = {
  children: React.PropTypes.any
};

export default ConfigProvider;
