express-params-handler
============

[![npm version](https://badge.fury.io/js/express-params-handler.svg)](https://badge.fury.io/js/express-params-handler)
![Build Status](https://github.com/Adslot/node-express-params-handler/workflows/Node.js%20CI/badge.svg)

Express.js v4+ params handler

This lib is replacement of [express-params](https://www.npmjs.com/package/express-params) which is made for
Express 2.5. Express v4+ deprecated number of features which are in use of that original library. This lib
offers similar functionality but doesn't use deprecated methods of new Express.


## Installation

    npm i express-params-handler


## Usage

```javascript
var expressParams = require('express-params-handler')

var app = express()

app.param('id', expressParams(Number))
app.param('date', expressParams(/^\d{4}-\d{2}-\d{2}$/))

app.get('/by-id/:id', function(req, res, next) {
  // req.params.id will be a number
})

app.get('/by-date/:date', function(req, res, next) {
  // req.params.date will be a string with YYYY-MM-DD format
})

```


## Licence

MIT
