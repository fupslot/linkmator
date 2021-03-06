'use strict';

const request = require('supertest');
const expect = require('expect');
const mongoose = require('mongoose');

const util = require('../server/util');
const testUtil = require('./util');
const Feed = require('../server/model/feed');
const OpenGraph = require('../server/model/opengraph');
const GraphModel = require('../server/model/graph.model');

const {
  SEED_GRAPH_EXAMPLE_COM
} = require('../server/common/seedefs');

describe('HTTP Server', function() {
  this.timeout(20000);

  before(testUtil.waitUntilServerIsReady);

  describe('POST /api/graph', function() {
    it('url shold not allowed html tags', function(done) {
      const accessToken = this.server.get('ACCESS_TOKEN');

      const url = '<script src="http://bad-host.com/script.js">';

      request(this.server)
        .post('/api/graph')
        .set('Cookie', `access_token=${accessToken}`)
        .send({url})
        .end(function(err, res) {
          const data = res.body;
          expect(data.status).toBe(400);
          expect(data.errors).toBeAn(Array);
          expect(data.errors[0].path).toEqual('url');
          done();
        });
    });

    it('url should be sanitized', function(done) {
      const accessToken = this.server.get('ACCESS_TOKEN');

      const rawUrl = 'Http://www.ExaMplE.cOm';
      const url = 'http://www.example.com';

      request(this.server)
        .post('/api/graph')
        .set('Cookie', `access_token=${accessToken}`)
        .send({ url: rawUrl })
        .end(function(err, res) {
          const data = res.body;
          expect(data.status).toBe(200);
          expect(data.errors).toNotExist();
          expect(data.data.url).toEqual(url);
          done();
        });
    });

    it('url should be required', function(done) {
      const accessToken = this.server.get('ACCESS_TOKEN');

      request(this.server)
        .post('/api/graph')
        .set('Cookie', `access_token=${accessToken}`)
        .send({})
        .end(function(err, res) {
          const data = res.body;
          expect(data.status).toBe(400);
          expect(data.errors).toBeA('array');
          expect(data.errors[0].path).toBe('url');
          done();
        });
    });

    it('should create a graph with minimun data', function(done) {
      const accessToken = this.server.get('ACCESS_TOKEN');

      request(this.server)
        .post('/api/graph')
        .set('Cookie', `access_token=${accessToken}`)
        .send({
          url: 'http://www.example.com'
        })
        .expect(201)
        .end(function(err, res) {
          const data = res.body.data;
          expect(data).toBeA('object');
          expect(data._id).toExist();
          done();
        });
    });
  });

  describe('POST /api/posts', function() {
    // it('"data" should exist', function(done) {
    //   const accessToken = this.server.get('ACCESS_TOKEN');
    //
    //   request(this.server)
    //     .post('/api/posts')
    //     .set('Cookie', `access_token=${accessToken}`)
    //     .send({})
    //     .expect(200)
    //     .end((err, res) => {
    //       expect(res.body.status).toEqual(400);
    //       done();
    //     });
    // });

    it('"graphId" should have a proper type', function(done) {
      const accessToken = this.server.get('ACCESS_TOKEN');

      request(this.server)
        .post('/api/posts')
        .set('Cookie', `access_token=${accessToken}`)
        .send({
          graphId: 'invalid value'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).toEqual(400);
          done();
        });
    });

    // Note: Need Seed Data
    it('should create a post', function(done) {
      const accessToken = this.server.get('ACCESS_TOKEN');

      GraphModel.findOne({
        url: SEED_GRAPH_EXAMPLE_COM
      }).then((graph) => {

        request(this.server)
          .post('/api/posts')
          .set('Cookie', `access_token=${accessToken}`)
          .send({
            graphId: graph.id
          })
          .expect(201)
          .end((error, res) => {
            expect(error).toNotExist();
            expect(res.body.data.post).toExist();
            done();
          });
      }).catch(done);
    });
  });


  describe('GET /api/posts', function() {
    it('should validate "type"', function(done) {

      this.api.posts.get({
        type: 'INVALID_VALUE'
      }).then(testUtil.expectError).then(({body}) => {
        expect(body.status).toEqual(400);
        expect(body.errors).toExist();
      }).then(done).catch(done);
    });

    it('should return a feed', function(done) {
      this.api.posts.get()
        .then(testUtil.expectSuccess)
        .then(({statusCode, body}) => {
          const STATUS = 200;

          expect(statusCode).toEqual(STATUS);
          expect(body.status).toEqual(STATUS);
          expect(body.data).toExist();
          expect(body.errors).toNotExist();
        }).then(done).catch(done);
    });

    it('should validate "timestime"', function(done) {
      this.api.posts.get({
        t: 'invalid_date'
      })
        .then(testUtil.expectError)
        .then(({body}) => {
          const { name, status, errors } = body;

          expect(name).toEqual('RequestError');
          expect(status).toEqual(400);
          expect(errors).toBeAn('array');
          expect(errors[0].message).toInclude(
            '"t" must be a valid date'
          );
        }).then(done).catch(done);
    });

    it('should fetch posts created after a timestamp', function(done) {
      const self = this;
      let query_t = null;

      const fetchPosts = (timestamp) => {
        return new Promise((resolve, reject) => {
          const request = self.GET('/api/posts');

          if (timestamp) {
            request.query({t: timestamp});
          }

          request.end((err, res) => {
            if (err) {
              reject(err);
            } else {
              query_t = res.body.data.timestamp;
              resolve(res.body);
            }
          });
        });
      };

      const createPost = (graph) => {
        return new Promise((resolve, reject) => {
          self.POST('/api/posts', {
            graphId: graph._id
          })
            .end((err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res.body);
              }
            });
        });
      };

      fetchPosts()
        .then(() => GraphModel.findOne({
          url: SEED_GRAPH_EXAMPLE_COM
        }))
        .then((graph) => {
          if (!graph) {
            Promise.reject(new Error(
              `Seed graph "${SEED_GRAPH_EXAMPLE_COM}" not found`
            ));
          }
          return graph;
        })
        .then((graph) => createPost(graph))
        .then(() => fetchPosts(query_t))
        .then((response) => {
          const {posts} = response.data;
          expect(posts).toBeAn('array');
          expect(posts.length).toBeGreaterThanOrEqualTo(1);
          done();
        })
        .catch(done);
    });

    it('should remove a post', function(done) {
      // this.api.posts.get();
      GraphModel.findOne({
        url: SEED_GRAPH_EXAMPLE_COM
      }).then((graph) => {
        return new Promise((resolve, reject) => {
          this.POST('/api/posts').send({
            graphId: graph.id
          }).end((err, res) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(res);
            }
          });
        });
      }).then((res) => {
        return new Promise((resolve, reject) => {
          this.DEL('/api/posts')
            .query({id: res.body.data.post._id})
            .end((err, res) => {
              expect(err).toNotExist();
              expect(res.body.status).toEqual(200);
              expect(res.body.data).toExist();
              done();
            });
        });
      }).catch(done);
    });
  });


  describe('Model: Feed', function() {
    it('should not accept custom "type"', (done) => {
      // see: server/model/feed.js for acceptable type values
      const feedData = {
        creator: mongoose.Schema.ObjectId(),
        type: 'NOT_ACCEPTABLE_TYPE',
        opengraph: mongoose.Schema.ObjectId()
      };

      const feed = new Feed(feedData);
      feed.validate().catch((error) => {
        expect(error.errors.type).toExist();
        done();
      });
    });

    it('should create a feed', function(done) {
      const feedData = {
        creator: mongoose.Schema.ObjectId(),
        type: 'PRIVATE',
        opengraph: mongoose.Schema.ObjectId()
      };

      Feed.create(feedData, (error, feed) => {
        expect(feed).toExist();
        done();
      });
    });
  });

  // describe('Post registration', function() {
  //   it('should create a person record', function(done) {
  //     const postRegistrationHandler = require(
  //       '../server/middleware/postRegistrationHandler'
  //     );
  //
  //     const account = {
  //       username: 'test@example.com',
  //       email: 'test@example.com',
  //       href: 'link_to_stormpath_account',
  //       givenName: 'Test',
  //       surname: 'Test',
  //       customData: {
  //         save: expect.createSpy().andCall((fn) => fn())
  //       }
  //     };
  //
  //     const next = () => {
  //       expect(account.customData.mongoId).toExist();
  //       expect(account.customData.save).toHaveBeenCalled();
  //     };
  //
  //     postRegistrationHandler(account, undefined, undefined, next)
  //       .then((model) => {
  //         // Should create Gravatar image url
  //         // See: http://en.gravatar.com/site/implement/images/
  //         const emailMd5Hash = util.getMD5Hash(account.email);
  //         expect(model.emailMd5Hash).toEqual(emailMd5Hash);
  //         expect(model.gravatarUrl).toEqual(
  //           util.createGravatarUrl(emailMd5Hash)
  //         );
  //
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });
});
