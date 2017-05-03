var fees = require('../../fees.json');

const FEE_TYPE_FIELD = 'order_item_type';
const FEE_SUBFEES_FIELD = 'fees';
const FEE_SUBFEES_TYPE_FIELD = 'type';
const FEE_AMOUNT_FIELD = 'amount';
const FEE_DIST_FIELD = 'distributions';

let feeLookupMap;

function buildFeeTypeLookupMap (feeLookupMap, feeTypeItem) {
  if (feeLookupMap[feeTypeItem[FEE_TYPE_FIELD]] === undefined) {
    let feeStructure = {};
    feeTypeItem[FEE_SUBFEES_FIELD].forEach((fee) => {
      feeStructure[fee[FEE_SUBFEES_TYPE_FIELD]] = fee[FEE_AMOUNT_FIELD];
    });
    feeStructure.distributions = feeTypeItem[FEE_DIST_FIELD];
    feeLookupMap[feeTypeItem[FEE_TYPE_FIELD]] = feeStructure;
  }
  return feeLookupMap;
}

// Functions as a weird singleton for fee lookup
// functionality would change if fees were actually hosted in a data store
class Fee {
  static getLookupMap () {
    if (feeLookupMap === undefined) {
      feeLookupMap = fees.reduce(buildFeeTypeLookupMap, {});
    }
    return feeLookupMap;
  }
  static setLookupMap (map) {
    feeLookupMap = map;
  }
}

module.exports = Fee;
