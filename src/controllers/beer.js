'use strict';

const BEERS = [{
    id: "0",
    name:"Double Dead Guy",
    rating: "5",
    type: "Ale",
    image: "/static/images/Double-Dead-Guy.png"
}, {
    id: "1",
    name:"Chocolate Stout",
    rating: "4.5",
    type: "Stout",
    image: "/static/images/Chocolate-Stout.png"
}];

var beersPrice = [{
    id: "0",
    name:"Double Dead Guy",
    vendorPrice: "12",
    consumerPrice:"25.99",
    discountPrice:"21.99",
    discountPriceActive: "1.0"
}, {
    id: "1",
    name:"Chocolate Stout",
    vendorPrice: "8",
    consumerPrice:"19.99",
    discountPrice:"18.99",
    discountPriceActive: "0.0"
}];


module.exports.get = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(BEERS),
  };

  callback(null, response);
};
