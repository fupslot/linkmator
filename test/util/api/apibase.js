'use strict';
const request = require('supertest');

class ApiBase {
  constructor(server) {
    this.accessToken = server.get('ACCESS_TOKEN');
    this._server = server;
  }

  GET(path) {
    return request(this._server)
      .get(path)
      .set('Cookie', `access_token=${this.accessToken}`);
  }
}

module.exports = ApiBase;
