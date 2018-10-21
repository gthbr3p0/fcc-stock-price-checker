/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var stockHandler = require('../controllers/stockHandler');


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      var stock = req.query.stock;
      var like = req.query.like || false;
      if (like == "true"){
        like = true;
      } else if (like == "false"){
        like = false;
      }
      var ip = req.connection.remoteAddress;
    
      stockHandler.get_stockData(stock, like, ip, function(err, data){
        if (err){
          res.status(400);
          setTimeout(() => res.send(err), 0);
        } else {
          setTimeout(() => res.send(data), 0);
        }
      })
    });
    
};
