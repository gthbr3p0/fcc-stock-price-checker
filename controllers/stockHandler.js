var request = require("request");
var MongoClient = require('mongodb');
var googleFinance = require("google-finance-data");
var CONNECTION = process.env.DB;

var get_other_data = function(stock, callback){
  if (Array.isArray(stock)){
    var stocksInfo = []
    googleFinance.getSymbol(stock[0])
      .then(function(data){
        var stockInfo = {
          stock: data.symbol,
          price: data.last,
          rel_likes: null
        }
        stocksInfo.push(stockInfo);
      
        googleFinance.getSymbol(stock[1])
      .then(function(data){
        var stockInfo = {
          stock: data.symbol,
          price: data.last,
          rel_likes: null
        }
        stocksInfo.push(stockInfo);
        callback(null, stocksInfo);
        })
        .catch(err => callback(err, null));
      })
      .catch(err => callback(err, null));
  } else {
    googleFinance.getSymbol(stock)
      .then(function(data){
        console.log(data)
        var stockInfo = {
          stock: data.symbol,
          price: data.last,
          likes: null
        }
        callback(null, stockInfo);
      })
      .catch(err => callback(err, null));
  }
}

var get_likes = function(stock, like, ip, callback){
  if (Array.isArray(stock)){
    get_likes(stock[0], like, ip, function(err, doc){
      if (err){
        callback("Database error", err)
      } else {
        var likes = [doc];
        get_likes(stock[1], like, ip, function(err, doc){
          if (err){
            callback("Database error", err)
          } else {
            likes.push(doc);
            callback(null, likes)
          }
        })
      }
    })
  } else {
    MongoClient.connect(CONNECTION, function(err, db){
      if (err){
        callback("Database error", err)
      } else {
        if (!like){
          db.collection("stocks").find({stock: stock}).toArray(function(err, doc){
            if (err){
              callback("Database error", err);
            } else {
              if (doc.length > 0){
                var likes = doc[0].likes.length;
                callback(null, likes);
              } else {
                callback(null, 0);
              }
            }
          })
        } else {
          db.collection("stocks").findAndModify(
            {stock: stock},
            [],
            {$addToSet: { likes: ip }},
            {new: true, upsert: true},
            function(err, doc){
              callback(null, doc.value.likes.length);
            });
        }
      }
    })
  }
}

var get_stockData = function(stock, like, ip, callback){
  get_other_data(stock, function(err, data){
    if (err){
      callback("Failed to connect to external resource", err)
    } else {
      var stockData = data;
      get_likes(stock, like, ip, function(err, data){
        if (err){
          callback("Failed to connect to database", err)
        } else {
          if (Array.isArray(stock)){
            stockData[0].rel_likes = data[0] - data[1];
            stockData[1].rel_likes = data[1] - data[0];
            callback(null, {stockData: stockData});
          } else {
            stockData.likes = data;
            callback(null, {stockData: stockData});
          }
        }
      })
    }
  })
}

module.exports = {
  get_stockData: get_stockData
}