var assert = require('assert');
var request = require('supertest');
var express = require('express');
var lib = require('../');

describe('express-params-handler', function () {
  var makeApp = function () {
    var app = express();
    app.param('id', lib(Number));
    app.param('date', lib(/^\d{4}-\d{2}-\d{2}$/));

    var handler = function (req, res, _next) {
      res.json({ params: req.params });
    };

    app.get('/by-id/:id', handler);
    app.get('/by-date/:date', handler);
    return app;
  };

  describe('function handlers', function () {
    it('positive', function (done) {
      request(makeApp())
        .get('/by-id/100')
        .expect(200, function (err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body.params, { id: 100 });
          done();
        });
    });

    it('negative', function (done) {
      request(makeApp())
        .get('/by-id/kraken')
        .expect(404, function (err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body, {});
          done();
        });
    });
  });

  describe('regexp handlers', function () {
    it('positive', function (done) {
      request(makeApp())
        .get('/by-date/2015-07-30')
        .expect(200, function (_err, res) {
          assert.deepEqual(res.body.params, { date: '2015-07-30' });
          done();
        });
    });

    it('negative', function (done) {
      request(makeApp())
        .get('/by-date/kraken')
        .expect(404, function (err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body, {});
          done();
        });
    });
  });

  describe('unsupported handler type', function () {
    it('should complain about invalid handler type', function () {
      assert.throws(function () {
        lib('nonsense');
      }, /Unsupported param handler/);
    });
  });
});
