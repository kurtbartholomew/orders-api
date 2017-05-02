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

const itemTypeLookupMap = fees.reduce(buildFeeTypeLookupMap,{});

function buildFeeTypeLookupMap(feeLookupMap, feeTypeItem) {
  if(feeLookupMap[feeTypeItem[fee_type_field]] === undefined) {
    let feeStructure = {};
    feeTypeItem[fee_subfees_field].forEach((fee) => {
      feeStructure[fee[fee_subfees_type_field]] = fee[fee_amount_field];
    });
    feeLookupMap[feeTypeItem[fee_type_field]] = feeStructure;
  }
  return feeLookupMap;
}

function returnOrderHeader(order) {
  return `Order ID: ${order[order_number_field]}\n`;
}

function returnOrderItem(orderItem, price) {
  return `   Order item ${orderItem[order_type_field]}: $${(price).toFixed(2)}\n`;
}

function returnOrderTotal(total) {
  return `   Order total: $${(total).toFixed(2)}\n`;
}

function outputOrderCosts() {
  console.log(orders.map(createOrder).join(""));
}

function createOrder(order) {
  let total = 0;
  let output = returnOrderHeader(order);
  order[order_items_field].forEach((orderItem) => {
    const price = calculatePriceOfOrderItem(orderItem);
    output += returnOrderItem(orderItem, price);
    total += price;
  });
  output += returnOrderTotal(total);
  return output;
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

outputOrderCosts();
