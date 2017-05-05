process.env.NODE_ENV = 'TEST';
const assert = require('assert');
const Order = require('./order');
const Fee = require('./fee');
const exampleOrders = require('../test/fixtures/testorders.json');
const exampleFees = require('../test/fixtures/testfeemap.json');

describe('Orders Model', function () {
  let matchingTotals;
  let matchingDistributions;

  before(function () {
    Fee.setLookupMap(exampleFees);
    matchingDistributions = {
      orders: [
        {
          order_number: '10',
          distributions: {
            'Large Fee 1': 10,
            'Smaller Fee 2': 10,
            'Smaller Fee 3': 5,
            'Additional Fees': 2,
            'Very Small Fee 1': 3,
            'Very Small Fee 2': 2
          }
        },
        { order_number: '11',
          distributions: {
            'Large Fee 1': 20,
            'Smaller Fee 2': 15,
            'Smaller Fee 3': 10,
            'Very Small Fee 1': 3,
            'Very Small Fee 2': 2,
            'Additional Fees': 4
          }
        }
      ],
      total: {
        'Large Fee 1': 30,
        'Smaller Fee 2': 25,
        'Smaller Fee 3': 15,
        'Additional Fees': 6,
        'Very Small Fee 1': 6,
        'Very Small Fee 2': 4
      }
    };
    matchingTotals = [
      { order_number: '10',
        order_items: [
          { type: 'Fee Type 1', price: 22 },
          { type: 'Fee Type 2', price: 10 }
        ],
        total: 32 },
      { order_number: '11',
        order_items: [
          { type: 'Fee Type 1', price: 20 },
          { type: 'Fee Type 2', price: 10 },
          { type: 'Fee Type 1', price: 24 }
        ],
        total: 54 }
    ];
  });

  describe('toTotalsJSON', function () {
    it('should throw an error if input is not an array', function () {
      assert.throws(() => { Order.toTotalsJSON({}); }, /not in the form of an array/);
    });

    it('should return the correct json payload', function () {
      const totals = Order.toTotalsJSON(exampleOrders);
      assert.deepEqual(totals, matchingTotals);
    });
  })

  describe('toDistributionJSON', function () {
    it('should throw an error if input is not an array', function () {
      assert.throws(() => { Order.toDistributionJSON({}); }, /not in the form of an array/);
    });

    it('should return the correct json payload', function () {
      const distributions = Order.toDistributionJSON(exampleOrders);
      assert.deepEqual(distributions, matchingDistributions);
    });
  });
});
