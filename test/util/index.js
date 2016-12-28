'use strict';
const request = require('supertest');

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

function whenServerReady(server) {
  return new Promise((resolve) => {
    server.on('application.ready', () => resolve(server));
  });
}

function loginTestUser(server) {
  return new Promise(function(resolve, reject) {
    const appConfig = server.get('appConfig');
    const {
      test_user_name,
      test_user_password
    } = appConfig.common.server;

    request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        grand_type: 'password',
        username: test_user_name,
        password: test_user_password
      })
      .end(function(err, req, res) {
        if (err) {
          return reject(err);
        }

        const accessToken = getAccessToken(req.headers['set-cookie']);
        server.set('ACCESS_TOKEN', accessToken);

        if (!accessToken) {
          reject(
            new Error(
              `Wrong credentials for the user ${test_user_name}.
              Perhaps ${test_user_name} doesn't exist in Stormpath`
            )
          );
        } else {
          resolve(server);
        }
      });
  });
}

function getUserCustomData(server) {
  return new Promise((resolve, reject) => {
    request(server)
      .get('/me')
      .set('Cookie', `access_token=${server.get('ACCESS_TOKEN')}`)
      .send({})
      .expect(200)
      .end(function(error, req, res) {
        if (error) {
          return reject(error);
        }

        const mongoId = req.body.account.customData.mongoId;

        if (!mongoId) {
          const appConfig = server.get('appConfig');
          const test_user_name = appConfig.common.server.test_user_name;

          return reject(
            new Error(
              `User ${test_user_name} has no "mongo_id".
              Check ${test_user_name} customData`
            )
          );
        }

        server.set('USER_MONGO_ID', mongoId);
        return resolve(server);
      });
  });
}

/**
 * @name waitUntilServerIsReady
 * @return {Promise}
 */
module.exports.waitUntilServerIsReady = function() {
  const self = this;
  self.server = require('../../server/app');

  return whenServerReady(self.server)
    .then(loginTestUser)
    .then(getUserCustomData);
};
