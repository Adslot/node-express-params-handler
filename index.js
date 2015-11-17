
module.exports = function(router) {
  return function(paramName, handler) {
    return router.param(paramName, function(req, res, next, val, name) {
      if (handler instanceof Function) {
        var newVal = handler(val)
        if (!newVal) {
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
