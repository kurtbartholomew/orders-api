var fees = require('../../fees.json');

const fee_type_field = "order_item_type";
const fee_subfees_field = "fees";
const fee_subfees_type_field = "type";
const fee_amount_field = "amount";
const flat_fee_type = "flat";
const fee_dist_field = "distributions";
const pay_per_fee_type = "per-page";

let feeLookupMap;

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

class Fee {
  static getLookupMap() {
    if(feeLookupMap === undefined ) {
      feeLookupMap = fees.reduce(buildFeeTypeLookupMap,{});
    }
    return feeLookupMap;
  }
  // any fee updating methods will set the lookup map to undefined
  // this is only effective if fees are not updated frequently
  // and there is no other caching mechanism
  // honestly it's just a really janky mechanism to speed
  // up fee lookups based out of a file instead of a data store
}

module.exports = Fee;
