
module.exports = function(router) {
  return function(name, handler) {
    return router.param(name, function(req, res, next, val) {
      var newVal;
      if (typeof handler === 'function') {
        if (!(newVal = handler(val))) {
          return next('route'); // bypass current route
        }
        req.params[name] = newVal;
      } else if (handler instanceof RegExp) {
        if (!handler.test(val)) {
          return next('route'); // bypass current route
        }
        req.params[name] = val;
      } else {
        throw new Error('Unsupported param handler. Either function or Regexp expected');
      }
      return next();
    });
  };
};
