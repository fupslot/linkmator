'use strict';
const request = require('supertest');
const server = require('../../server/app');

function getAccessToken(values) {
  if (values && values.length > 0) {
    for (var i = 0; i < values.length; i++) {
      if (values[i].startsWith('access_token')) {
        return values[i].substr(values[i].indexOf('=') + 1, values[i].length);
      }
    }
  }
  return null;
}

/**
 * @name waitUntilServerIsReady
 * @desc Waits until an authentication is successed
 * @return {Promise}
 */
module.exports.waitUntilServerIsReady = function() {
  const self = this;

  self.server = server;
  self.accessToken = null;

  return (new Promise(function(resolve) {
    server.on('application.ready', resolve);
  })).then(function() {
    return new Promise(function(resolve, reject) {
      request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          grand_type: 'password',
          username: 'fupslot@gmail.com',
          password: 'C1cer0mq'
        })
        .end(function(err, req, res) {
          if (err) {
            return reject(err);
          }

          self.accessToken = getAccessToken(req.headers['set-cookie']);

          if (!self.accessToken) {
            reject();
          } else {
            resolve();
          }
        });
    });
  });
};
