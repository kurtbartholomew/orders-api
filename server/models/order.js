const Fee = require('./fee');

const ORDER_ITEMS_FIELD = 'order_items';
const ORDER_NUMBER_FIELD = 'order_number';
const ORDER_TYPE_FIELD = 'type';
const ORDER_ITEM_PAGES_FIELD = 'pages';
const FEE_SUBFEES_TYPE_FIELD = 'type';
const FEE_AMOUNT_FIELD = 'amount';
const FLAT_FEE_TYPE = 'flat';
const FEE_DIST_FIELD = 'distributions';
const PAY_PER_FEE_TYPE = 'per-page';
const NEW_ORDER_ITEM_PRICE_FIELD = 'price';
const NEW_ORDER_TOTAL_FIELD = 'total';
const FEE_DIST_NAME_FIELD = 'name';
const NAME_OF_UNACCOUNTED_DISTRIBUTION = 'Additional Fees';

class Order {
  static toTotalsJSON (orders) {
    if (orders === undefined || !Array.isArray(orders)) {
      throw new Error('Order data was not in the form of an array');
    }
    return calcPerOrderData(orders);
  }
  static toDistributionJSON (orders) {
    if (orders === undefined || !Array.isArray(orders)) {
      throw new Error('Order data was not in the form of an array');
    }
    return calcOrdersDistribution(orders);
  }
}

function calcPerOrderData (orders) {
  return orders.map(transformOrderDataForLineItems);
}

function transformOrderDataForLineItems (order) {
  let newOrderItem = {};
  newOrderItem[ORDER_NUMBER_FIELD] = order[ORDER_NUMBER_FIELD];
  newOrderItem[ORDER_ITEMS_FIELD] = order[ORDER_ITEMS_FIELD].map(calcOrderItemWithCost);
  newOrderItem[NEW_ORDER_TOTAL_FIELD] = calculateOrderTotal(newOrderItem[ORDER_ITEMS_FIELD]);
  return newOrderItem;
}

function calcOrderItemWithCost (orderItem) {
  let itemWithCost = {};
  itemWithCost[FEE_SUBFEES_TYPE_FIELD] = orderItem[FEE_SUBFEES_TYPE_FIELD];
  itemWithCost[NEW_ORDER_ITEM_PRICE_FIELD] = calculatePriceOfOrderItem(orderItem);
  return itemWithCost;
}

function calculateOrderTotal (newOrderItems) {
  return newOrderItems.reduce((total, orderItem) => {
    return total + orderItem[NEW_ORDER_ITEM_PRICE_FIELD];
  }, 0);
}

function calculatePriceOfOrderItem (orderItem) {
  const itemTypeLookupMap = Fee.getLookupMap();
  if (itemTypeLookupMap[orderItem[ORDER_TYPE_FIELD]] === undefined) {
    throw new Error("Type of order item doesn't exist: " + orderItem[ORDER_TYPE_FIELD]);
  }
  const feeStructure = itemTypeLookupMap[orderItem[ORDER_TYPE_FIELD]];
  let price = 0;
  if (feeStructure[FLAT_FEE_TYPE] !== undefined) {
    price += Number(feeStructure[FLAT_FEE_TYPE]);
  }
  if (feeStructure[PAY_PER_FEE_TYPE] !== undefined) {
    if (orderItem[ORDER_ITEM_PAGES_FIELD] !== undefined) {
      let amount = Number(orderItem[ORDER_ITEM_PAGES_FIELD]);
      if (amount > 1) {
        price += (Number(feeStructure[PAY_PER_FEE_TYPE]) * (amount - 1))
      }
    }
  }
  return price;
}

// Distributions
function calcOrdersDistribution (orders) {
  let distributions = { orders: [], total: {} };

  orders.forEach(function (order) {
    const orderDistribution = order[ORDER_ITEMS_FIELD].reduce(
      calcOrderItemDistribution,
      {}
    );
    let distributionWithOrderNum = {};
    distributionWithOrderNum[ORDER_NUMBER_FIELD] = order[ORDER_NUMBER_FIELD];
    distributionWithOrderNum[FEE_DIST_FIELD] = orderDistribution;
    distributions.orders.push(distributionWithOrderNum);
    addToOverallDistribution(distributions.total, orderDistribution);
  });
  return distributions;
}

function addToOverallDistribution (overall, current) {
  for (let key in current) {
    if (overall[key] === undefined) {
      overall[key] = 0;
    }
    overall[key] += current[key];
  }
  return overall;
}

function calcOrderItemDistribution (currentOrderDistributions, orderItem) {
  const fundDistribution = calculateDistributionOfOrderItem(orderItem);
  for (let key in fundDistribution) {
    if (currentOrderDistributions[key] === undefined) {
      currentOrderDistributions[key] = 0;
    }
    currentOrderDistributions[key] += fundDistribution[key];
  }
  return currentOrderDistributions;
}

function calculateDistributionOfOrderItem (orderItem) {
  const itemTypeLookupMap = Fee.getLookupMap();
  if (itemTypeLookupMap[orderItem[ORDER_TYPE_FIELD]] === undefined) {
    throw new Error("Type of order item doesn't exist: " + orderItem[ORDER_TYPE_FIELD]);
  }
  const feeStructure = itemTypeLookupMap[orderItem[ORDER_TYPE_FIELD]];
  let distribution = {};
  let amount = Number(orderItem[ORDER_ITEM_PAGES_FIELD]);
  if (feeStructure[FLAT_FEE_TYPE] !== undefined) {
    feeStructure[FEE_DIST_FIELD].forEach(function (distItem) {
      distribution[distItem[FEE_DIST_NAME_FIELD]] = Number(distItem[FEE_AMOUNT_FIELD]);
    });
  }
  // No instruction as to whether I should ignore per-page charges
  // since they do not seem to be part of the distributions
  // so I'll just add them as additional fees for consistency
  if (feeStructure[PAY_PER_FEE_TYPE] !== undefined) {
    if (amount > 1) {
      distribution[NAME_OF_UNACCOUNTED_DISTRIBUTION] = (Number(feeStructure[PAY_PER_FEE_TYPE]) * (amount - 1))
    }
  }
  return distribution;
}

module.exports = Order;
