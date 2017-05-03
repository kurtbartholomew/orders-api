const Order = require('../models/order');

exports.totals = (req, res, next) => {
  const orders = req.body;
  let responseBody = {};
  try {
    responseBody.result = Order.toTotalsJSON(orders);
    responseBody.status = 'OK';
    res.json(responseBody);
  } catch (err) {
    err.status = 400;
    err.message = 'Payload was unprocessable';
    next(err)
  }
}

exports.distributions = (req, res, next) => {
  var orders = req.body;
  let responseBody = {};
  try {
    responseBody.result = Order.toDistributionJSON(orders);
    responseBody.status = 'OK';
  } catch (err) {
    responseBody.error = 'Payload was not processable';
    responseBody.status = 'FAILURE';
  }
  res.json(responseBody);
}
