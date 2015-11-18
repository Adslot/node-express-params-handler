var assert = require('assert')
var request = require('supertest')
var express = require('express')
var lib = require('../')


describe('express-params-handler', function() {

  var makeApp = function() {
    var app = express()

    var handler = function(req, res, next) {
      res.json({params: req.params})
    }

    app.get('/by-id/:id', handler)
    app.get('/by-date/:date', handler)
    return app
  }

  var makeAppWithHandlerOfParams = function() {
    var app = makeApp();

    app.param('id', lib(Number))
    app.param('date', lib(/^\d{4}-\d{2}-\d{2}$/))

    return app
  }

  var makeAppWithModifyingHandlerOfParams = function() {
    var app = makeApp();

    app.param('id', function(req, res, next, value) {
      req.params.id = value === 'current' ? 100 : value;
      next();
    })
    app.param('id', lib(Number))

    app.param('date', function(req, res, next, value) {
      req.params.date = value === 'current' ? '2015-07-30' : value;
      next();
    })
    app.param('date', lib(/^\d{4}-\d{2}-\d{2}$/))

    return app
  }

  describe('function handlers', function() {

    it('positive', function(done) {
      request(makeAppWithHandlerOfParams())
        .get('/by-id/100')
        .expect(200, function(err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body.params, {id: 100})
          done()
        })
    })

    it('negative', function(done) {
      request(makeAppWithHandlerOfParams())
        .get('/by-id/kraken')
        .expect(404, function(err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, {})
          done()
        })
    })

    it('use actual param value from req.params', function(done) {
      request(makeAppWithModifyingHandlerOfParams())
        .get('/by-id/current')
        .expect(200, function(err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body.params, {id: 100})
          done()
        })
    })

  })


  describe('regexp handlers', function() {

    it('positive', function(done) {
      request(makeAppWithHandlerOfParams())
        .get('/by-date/2015-07-30')
        .expect(200, function(err, res) {
          assert.deepEqual(res.body.params, {date: '2015-07-30'})
          done()
        })
    })

    it('negative', function(done) {
      request(makeAppWithHandlerOfParams())
        .get('/by-date/kraken')
        .expect(404, function(err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, {})
          done()
        })
    })

    it('use actual param value from req.params', function(done) {
      request(makeAppWithModifyingHandlerOfParams())
        .get('/by-date/current')
        .expect(200, function(err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body.params, {date: '2015-07-30'})
          done()
        })
    })

  })


  describe('unsupported handler type', function() {

    it('should complain about invalid handler type', function() {
      assert.throws(function() {
        lib('nonsense')
      }, /Unsupported param handler/)
    })

  })

})
