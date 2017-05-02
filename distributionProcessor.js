const orders = require('./orders.json');
const fees = require('./fees.json');
const order_items_field = "order_items";
const order_number_field = "order_number";
const order_type_field = "type";
const order_item_pages_field = "pages";
const fee_type_field = "order_item_type";
const fee_subfees_field = "fees";
const fee_subfees_type_field = "type";
const fee_amount_field = "amount";
const flat_fee_type = "flat";
const pay_per_fee_type = "per-page";
const fee_dist_field = "distributions";
const fee_dist_name_field = "name";

const itemTypeLookupMap = fees.reduce(buildFeeTypeLookupMap,{});

function buildFeeTypeLookupMap(feeLookupMap, feeTypeItem) {
  if(feeLookupMap[feeTypeItem[fee_type_field]] === undefined) {
    let feeStructure = {};
    feeTypeItem[fee_subfees_field].forEach((fee) => {
      feeStructure[fee[fee_subfees_type_field]] = fee[fee_amount_field];
    });
    feeStructure.distributions = feeTypeItem["distributions"];
    feeLookupMap[feeTypeItem[fee_type_field]] = feeStructure;
  }
  return feeLookupMap;
}

function returnOrderHeader(order) {
  return `Order ID: ${order[order_number_field]}\n`;
}

function returnOrderDistribution(dist, amount) {
  return `   Fund - ${dist}: $${(amount).toFixed(2)}\n`;
}

function returnOverallTotalHeader() {
  return `Total distributions:\n`;
}

function outputDistributions(distributions) {
  let output = createOrdersDistributions(distributions.orders);
  output += createTotalDistributions(distributions.total);
  console.log(output);
}

function createOrdersDistributions(orders) {
  return orders.reduce(function(ordersString, order){
    ordersString += returnOrderHeader(order);
    return ordersString + createOrderDistribution(order.orderDistribs);
  },"")
}

function createOrderDistribution(order) {
  var output = "";
  for(let distrib in order) {
    output += returnOrderDistribution(distrib, order[distrib]);
  }
  return output;
}

function createTotalDistributions(totals) {
  let output = returnOverallTotalHeader();
  return output + createOrderDistribution(totals);
}

function createOrders() {
  const distributions = createOrdersDistribution(orders);
  outputDistributions(distributions);
}

function createOrdersDistribution(orders) {
  let distributions = { orders:[], total:{} };
  
  orders.forEach(function(order) {
    const orderDistribution = order[order_items_field].reduce(
      calcOrderItemDistribution,
      {}
    );
    // TODO: Fix this so it's not hardcoded
    distributions.orders.push({
      order_number: order[order_number_field],
      orderDistribs: orderDistribution
    });
    addToOverallDistribution(distributions.total, orderDistribution);
  });
  return distributions;
}

function addToOverallDistribution(overall, current) {
  for(let key in current) {
    if(overall[key] === undefined) {
      overall[key] = 0;
    }
    overall[key] += current[key];
  }
  return overall;
}

function calcOrderItemDistribution(currentOrderDistributions, orderItem) {
  const fundDistribution = calculateDistributionOfOrderItem(orderItem);
  for(let key in fundDistribution) {
    if(currentOrderDistributions[key] === undefined) {
      currentOrderDistributions[key] = 0;
    }
    currentOrderDistributions[key] += fundDistribution[key];
  }
  return currentOrderDistributions;
}

function calculateDistributionOfOrderItem(orderItem) {
  if(itemTypeLookupMap[orderItem[order_type_field]] === undefined) {
    throw new Error("Type of order item doesn't exist: " + orderItem[order_type_field]);
  }
  const feeStructure = itemTypeLookupMap[orderItem[order_type_field]];
  let distribution = {};
  let amount = Number(orderItem[order_item_pages_field]);
  if(feeStructure[flat_fee_type] !== undefined) {
    feeStructure[fee_dist_field].forEach(function(distItem){
      distribution[distItem[fee_dist_name_field]] = Number(distItem[fee_amount_field]);
    });
  }
  if(feeStructure[pay_per_fee_type] !== undefined) {
    if(amount > 1) {
      distribution["additional_fees"] = (Number(feeStructure[pay_per_fee_type]) * (amount - 1))
    }
  }
  return distribution;
}


createOrders();
