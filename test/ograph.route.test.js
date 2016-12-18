'use strict';

const request = require('supertest');
const expect = require('expect');
const util = require('./util');


describe('HTTP Server', function() {
  this.timeout(20000);

  before(util.waitUntilServerIsReady);

  describe('POST /api/og', function() {
    it('"url" should be required', function(done) {
      request(this.server)
        .post('/api/og')
        .set('Cookie', `access_token=${this.accessToken}`)
        .send({})
        .expect(400)
        .end(function(err, req, res) {
          const data = req.body;
          expect(data.status).toBe(400);
          expect(data.errors).toBeA('array');
          expect(data.errors[0].path).toBe('url');
          done();
        });
    });

    it('should create a graph with minimun data', function(done) {
      request(this.server)
        .post('/api/og')
        .set('Cookie', `access_token=${this.accessToken}`)
        .send({
          url: 'http://www.example.com'
        })
        .expect(201)
        .end(function(err, req, res) {
          const data = req.body.data;
          expect(data).toBeA('object');
          expect(data._id).toExist();
          done();
        });
    });
  });
});
