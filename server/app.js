var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var orders = require('./routes/orders');

var app = express();

if (process.env.NODE_ENV !== 'TEST') {
  app.use(logger('combined'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/orders/totals', orders.totals);
app.post('/api/orders/distributions', orders.distributions);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
