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
const fee_dist_field = "distributions";
const pay_per_fee_type = "per-page";
const new_order_item_price_field = "price";
const new_order_total_field = "total";

const itemTypeLookupMap = fees.reduce(buildFeeTypeLookupMap,{});

function buildFeeTypeLookupMap(feeLookupMap, feeTypeItem) {
  if(feeLookupMap[feeTypeItem[fee_type_field]] === undefined) {
    let feeStructure = {};
    feeTypeItem[fee_subfees_field].forEach((fee) => {
      feeStructure[fee[fee_subfees_type_field]] = fee[fee_amount_field];
    });
    feeStructure.distributions = feeTypeItem[fee_dist_field];
    feeLookupMap[feeTypeItem[fee_type_field]] = feeStructure;
  }
  return feeLookupMap;
}

// ==================== TEMPLATING START ======================

function generateOrderHeader(orderNumber) {
  return `Order ID: ${orderNumber}\n`;
}

function generateOrderLineItem(type, price) {
  return `   Order item ${type}: $${(price).toFixed(2)}\n`;
}

function generateOrderTotal(total) {
  return `   Order total: $${(total).toFixed(2)}\n`;
}

function outputOrderCosts(orderData) {
  const output = generateOrdersOutput(orderData);
  console.log(output);
}

function generateSingleOrderOutput(order) {
  let output = generateOrderHeader(order[order_number_field]);
  output += order[order_items_field].map(generateLineItemOutput).join("");
  output += generateOrderTotal(order[new_order_total_field]);
  return output;
}

function generateOrdersOutput(orderData) {
  return orderData.map(generateSingleOrderOutput).join("");
}

function generateLineItemOutput(orderItem) {
  return generateOrderLineItem(orderItem[fee_subfees_type_field], orderItem[new_order_item_price_field]);
}

// ==================== TEMPLATING END ======================

// ============ DATA TRANSFORMATION START ======================

function calcPerOrderData(orders) {
  return orders.map(transformOrderDataForLineItems);
}

function transformOrderDataForLineItems(order) {
  let newOrderItem = {};
  newOrderItem[order_number_field] = order[order_number_field];
  newOrderItem[order_items_field] = order[order_items_field].map(calcOrderItemWithCost);
  newOrderItem[new_order_total_field] = calculateOrderTotal(newOrderItem[order_items_field]);
  return newOrderItem;
}

function calcOrderItemWithCost(orderItem) {
  let itemWithCost = {};
  itemWithCost[fee_subfees_type_field] = orderItem[fee_subfees_type_field];
  itemWithCost[new_order_item_price_field] = calculatePriceOfOrderItem(orderItem);
  return itemWithCost;
}

function calculateOrderTotal(newOrderItems) {
  return newOrderItems.reduce((total, orderItem) => {
    return total + orderItem[new_order_item_price_field];
  },0);
}

function calculatePriceOfOrderItem(orderItem) {
  if(itemTypeLookupMap[orderItem[order_type_field]] === undefined) {
    throw new Error("Type of order item doesn't exist: "+orderItem[order_type_field]);
  }
  const feeStructure = itemTypeLookupMap[orderItem[order_type_field]];
  let price = 0;
  if(feeStructure[flat_fee_type] !== undefined) {
    price += Number(feeStructure[flat_fee_type]);
  }
  if(feeStructure[pay_per_fee_type] !== undefined) {
    if(orderItem[order_item_pages_field] !== undefined) {
      amount = Number(orderItem[order_item_pages_field]);
      if(amount > 1) {
        price += (Number(feeStructure[pay_per_fee_type]) * (amount - 1))
      }
    }
  }
  return price;
}

// ============ DATA TRANSFORMATION END ======================

// ==================== MAIN START ===========================

outputOrderCosts(calcPerOrderData(orders));
