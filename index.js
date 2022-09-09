
module.exports = function(handler) {
  if (!(handler instanceof Function || handler instanceof RegExp))
    throw new Error('Unsupported param handler. Either function or Regexp expected')

  return function(req, _res, next, _val, name) {
    const handlerValue = req.params[name];

    if (handler instanceof Function) {
      const newVal = handler(handlerValue)
      if (!newVal)
        return next('route'); // bypass current route
      req.params[name] = newVal

    } else if (handler instanceof RegExp) {
      if (!handler.test(handlerValue))
        return next('route') // bypass current route

    } else {
      throw new Error('Should not reach here')
    }

    return next();
  }
}
