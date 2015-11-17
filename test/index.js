var assert = require('assert'),
  lib = require('../')


describe('express-params-handler', function() {

  var app = {
    params: {},
    param: function(name, fn) {
      app.params[name] = fn
    }
  };
  var req, res, next;

  beforeEach(function() {
    app.params = {}
    req = {params: {}}
    res = {}
  })


  describe('function handlers', function() {

    it('positive', function(done) {
      lib(app)('id', Number)

      next = function(mode) {
        assert.equal(mode, undefined)
        assert.equal(req.params.id, 100)
        done()
      }

      app.params['id'](req, res, next, '100', 'id')
    })

    it('negative', function(done) {
      lib(app)('id', Number)

      next = function(mode) {
        assert.equal(mode, 'route')
        assert.equal(req.params.id, undefined)
        done()
      }

      app.params['id'](req, res, next, 'kraken', 'id')
    })

  })


  describe('regexp handlers', function() {

    it('positive', function(done) {
      lib(app)('date', /^\d{4}-\d{2}-\d{2}$/)

      next = function(mode) {
        assert.equal(mode, undefined)
        assert.equal(req.params.date, '2015-07-30')
        done()
      }

      app.params['date'](req, res, next, '2015-07-30', 'date')
    })

    it('negative', function(done) {
      lib(app)('date', /^\d{4}-\d{2}-\d{2}$/)

      next = function(mode) {
        assert.equal(mode, 'route')
        assert.equal(req.params.date, undefined)
        done()
      }

      app.params['date'](req, res, next, 'kraken', 'date')
    })

  })


  describe('unsupported handler type', function() {

    it('should complain', function() {
      assert.throws(function() {
        lib(app)('id', 'what?')
        app.params['id'](req, res, next, 'whatever', 'id')
      }, /Unsupported param handler/)
    })

  })

})
