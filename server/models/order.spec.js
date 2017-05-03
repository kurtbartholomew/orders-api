const assert = require('assert');

const Order = require('./order');

const exampleOrders = [
  {
    'order_number': '10',
    'order_items': [
      {
        'type': 'Fee Type 1',
        'pages': 3
      },
      {
        'type': 'Fee Type 2',
        'pages': 1
      }
    ]
  },
  {
    'order_number': '11',
    'order_items': [
      {
        'type': 'Fee Type 1',
        'pages': 1
      },
      {
        'type': 'Fee Type 2',
        'pages': 1
      },
      {
        'type': 'Fee Type 1',
        'pages': 5
      }
    ]
  }
];

const exampleFees = {
  'Fee Type 1': {
    'flat': 20.00,
    'per-page': 1.00
  },
  'Fee Type 2': {
    'flat': 10.00
  }
};

describe('Orders', function () {
  it('should return the correct totals', function () {
    const totals = Order.toTotalsJSON(exampleOrders, exampleFees);
    assert.deepEquals(totals, {});
  });
});
