const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const orders = require('./routes/orders');

// =========== Logging Start =====================

const logger = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
});

// =========== Logging End =======================

// =========== App Config and Routes Start =======

let app = express();

if (process.env.NODE_ENV !== 'TEST') {
  app.use(logger('combined', {stream: accessLogStream}));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/orders/totals', orders.totals);
app.post('/api/orders/distributions', orders.distributions);

// =========== App Config and Routes End =========

// =========== Error Handler Start ===============

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

// =========== Error Handler End ==================

module.exports = app;
