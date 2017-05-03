const request = require('supertest');
const app = require('../app');

describe('Orders API', function () {
  it('should return 400 when given a non-array payload', function (done) {
    request(app)
      .post('/api/orders/totals')
      .expect(400)
      .end(function (err, res) {
        if (err) { return done(err); }
        done();
      });
  });
  it('should return 200 when given an array', function (done) {
    request(app)
      .post('/api/orders/totals')
      .send([])
      .expect(200)
      .end(function (err, res) {
        if (err) { return done(err); }
        done();
      });
  });
});
