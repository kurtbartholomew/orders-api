process.env.NODE_ENV = 'TEST';
const request = require('supertest');
const app = require('../app');
const exampleOrders = require('../test/fixtures/testorders.json');
const exampleFees = require('../test/fixtures/testfeemap.json');
const matchingTotalsResponseData = require('../test/fixtures/testOrdersTotalsResponse.json');
const matchingDistributionsResponseData = require('../test/fixtures/testOrdersDistributionsResponse.json');
const Fee = require('../models/fee.js');

describe('Orders API', function () {
  before(function () {
    Fee.setLookupMap(exampleFees);
  });

  describe('totals endpoint', function () {
    it('should return 400 when given a non-array payload', function (done) {
      request(app)
        .post('/api/orders/totals')
        .expect(400)
        .end(function (err, res) {
          if (err) { return done(err); }
          done();
        });
    });
    it('should return 400 with errors when given a badly formed payload', function (done) {
      request(app)
        .post('/api/orders/totals')
        .send([{'order_it': []}, {'order_it': [{'pages': 10}]}])
        .expect(400, {errors: ['Payload was unprocessable']})
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
    it('should return valid totals in the data field when given valid orders', function (done) {
      request(app)
        .post('/api/orders/totals')
        .send(exampleOrders)
        .expect(200, matchingTotalsResponseData)
        .end(function (err, res) {
          if (err) { return done(err); }
          done();
        });
    });
  });

  describe('distributions endpoint', function () {
    it('should return 400 when given a non-array payload', function (done) {
      request(app)
        .post('/api/orders/distributions')
        .expect(400)
        .end(function (err, res) {
          if (err) { return done(err); }
          done();
        });
    });
    it('should return 400 with errors when given a badly formed payload', function (done) {
      request(app)
        .post('/api/orders/distributions')
        .send([{'order_it': []}, {'order_it': [{'pages': 10}]}])
        .expect(400, {errors: ['Payload was unprocessable']})
        .end(function (err, res) {
          if (err) { return done(err); }
          done();
        });
    });
    it('should return 200 when given an array', function (done) {
      request(app)
        .post('/api/orders/distributions')
        .send([])
        .expect(200)
        .end(function (err, res) {
          if (err) { return done(err); }
          done();
        });
    });
    it('should return valid totals in a data field when given valid orders', function (done) {
      request(app)
        .post('/api/orders/distributions')
        .send(exampleOrders)
        .expect(200, matchingDistributionsResponseData)
        .end(function (err, res) {
          if (err) { return done(err); }
          done();
        });
    });
  });
});
