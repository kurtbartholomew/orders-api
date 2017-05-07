# Orders API

Orders API is a server based implementation of a simple order processing JSON API following the [JSON API Schema](http://jsonapi.org/).
Single execution order processors are also included for totals and distributions.

## Requirements

* Node: Version 6.0 or greater
* NPM: Version 3.0 or greater (suggested)

## Setup

If you intend to use the server JSON API, navigate to the /server directory and use the following command:
```
npm install
```
or you may use `yarn install` if you prefer to use yarn

## Usage

To run the totals order processor stand alone file, use the following command:

```
node orderProcessor.js
```

To run the distributions order processor stand alone file, use the following command:

```
node orderProcessor.js
```

To utilize the server-based JSON API, navigate to the /server directory and use either of the following commands:
```
node bin/www
```
or
```
npm start
```

*Note that if not passed a port, the server will operate on port 3000*

## Examples

In order to access the API properly, you should have a utility like [curl](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/)

An example use of curl to access the API would be the following:
```
curl -X POST -H "Content-Type: application/json" -d @orders.json http://localhost:3000/api/orders/totals
```

* **POST**: (**Required**) The HTTP method used (the API only responds to POST requests currently)
* **Content-Type: application/json**: (**Required**) Informs the server that the provided payload should be parsed as JSON
* **@orders.json**: (**Required**) The JSON payload to be processed (using a valid json string or a local file via @ is acceptable)
* **localhost:3000/api/orders/totals**: (**Required**) The server endpoint for processing orders data

Results from the above request should be returned in the form of:

```
{
  data:
  [
    { 
      order_number: '10',
      order_items: [
        { type: 'Fee Type 1', price: 22 },
        { type: 'Fee Type 2', price: 10 }
      ],
      total: 32 
    },
    { 
      order_number: '11',
      order_items: [
        { type: 'Fee Type 1', price: 20 },
        { type: 'Fee Type 2', price: 10 },
        { type: 'Fee Type 1', price: 24 }
      ],
      total: 54 
    }
  ]
}
```
for a successful response or
```
{
  errors:
  [
    "Payload was unprocessable"
  ]
}
```
for a failure

## Tests

To run the associated test suite, navigate to the /server directory and use the following command:
```
npm test
```

## Live testing
A live version of this API can be found at http://kofileorderapi.party
