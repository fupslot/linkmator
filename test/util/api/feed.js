'use string';
const ApiBase = require('./apibase');

class FeedApi extends ApiBase {
  constructor(server) {
    super(server);
  }

  get(query) {
    return new Promise((resolve, reject) => {
      const request = this.GET('/api/feed');

      query && request.query(query);

      request
        .end((err, res) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(res);
          }
        });
    });
  }
}

function feedApiConstructor(server) {
  return new FeedApi(server);
}

module.exports = feedApiConstructor;
