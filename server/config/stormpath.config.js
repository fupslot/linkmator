'use strict';

module.exports = () => {
  return {
    api_key: process.env.STORMPATH_API_KEY_ID,
    api_secret: process.env.STORMPATH_API_KEY_SECRET,
    app_href: process.env.STORMPATH_APP_HREF
  };
};
