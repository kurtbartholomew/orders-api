const Order = require("../models/order");

exports.totals = (req, res, next) => {
  debugger;
  const orders = req.body;
  let totals;
  try {
    totals = Order.toTotalsJSON(orders);
  } catch(err) {
    next(err);
  }
  res.json(totals);
}

exports.distributions = (req, res, next) => {
  var orders = req.body;
  let totals;
  try {
    distributions = Order.toDistributionJSON(orders);
  } catch(err) {
    next(err);
  }
  res.json(distributions);
}
