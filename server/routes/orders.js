const Order = require('../models/order');

exports.totals = (req, res, next) => {
  const orders = req.body;
  let responseBody = {};
  try {
    responseBody.data = Order.toTotalsJSON(orders);
    res.json(responseBody);
  } catch (err) {
    responseBody.errors = ['Payload was unprocessable'];
    res.status(400).json(responseBody);
    next(err);
  }
}

exports.distributions = (req, res, next) => {
  var orders = req.body;
  let responseBody = {};
  try {
    responseBody.data = Order.toDistributionJSON(orders);
    res.json(responseBody);
  } catch (err) {
    responseBody.errors = ['Payload was unprocessable'];
    res.status(400).json(responseBody);
    next(err);
  }
}
