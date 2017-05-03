const assert = require('assert');
const Order = require('./order');
const Fee = require('./fee');

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
    'per-page': 1.00,
    'distributions': [
      {
        'name': 'Large Fee 1',
        'amount': 10
      },
      {
        'name': 'Smaller Fee 2',
        'amount': 5
      },
      {
        'name': 'Smaller Fee 3',
        'amount': 5
      }
    ]
  },
  'Fee Type 2': {
    'flat': 10.00,
    'distributions': [
      {
        'name': 'Smaller Fee 2',
        'amount': 5
      },
      {
        'name': 'Very Small Fee 1',
        'amount': 3
      },
      {
        'name': 'Very Small Fee 2',
        'amount': 2
      }
    ]
  }
};

describe('Orders', function () {
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

  it('should return the correct totals', function () {
    const totals = Order.toTotalsJSON(exampleOrders);
    assert.deepEqual(totals, matchingTotals);
  });

  it('should return the correct distributions', function () {
    const distributions = Order.toDistributionJSON(exampleOrders);
    assert.deepEqual(distributions, matchingDistributions);
  });
});
