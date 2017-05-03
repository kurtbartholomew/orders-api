const Fee = require("./fee");

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
const fee_dist_name_field = "name";
const name_of_unaccounted_distribution = "Additional Fees";

class Order {
  static toTotalsJSON(orders) {
    return calcPerOrderData(orders);
  }
  static toDistributionJSON(orders) {
    
  }
}

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
  const itemTypeLookupMap = Fee.getLookupMap();
  if(itemTypeLookupMap[orderItem[order_type_field]] === undefined) {
    throw new Error("Type of order item doesn't exist: " + orderItem[order_type_field]);
  }
  const feeStructure = itemTypeLookupMap[orderItem[order_type_field]];
  let price = 0;
  if(feeStructure[flat_fee_type] !== undefined) {
    price += Number(feeStructure[flat_fee_type]);
  }
  if(feeStructure[pay_per_fee_type] !== undefined) {
    if(orderItem[order_item_pages_field] !== undefined) {
      let amount = Number(orderItem[order_item_pages_field]);
      if (amount > 1) {
        price += (Number(feeStructure[pay_per_fee_type]) * (amount - 1))
      }
    }
  }
  return price;
}






module.exports = Order;
