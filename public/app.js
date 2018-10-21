document.querySelector("#single_submit").onclick = function(e){
  if (document.querySelector("#single_stock").value.length > 0){
    var stock = document.querySelector("#single_stock").value;
    var like;
    (document.querySelector("#single_like").checked) ? like = "true" : like = "false";
    var URL = "/api/stock-prices?stock=" + stock + "&like=" + like;
    fetch(URL).then(function(response){
      response.json().then(function(data){
        document.querySelector("#jsonResult").innerHTML = JSON.stringify(data);
      }).catch(function(response){
        alert("No valid response");
      })
    })
  }
}

document.querySelector("#double_submit").onclick = function(e){
  if (document.querySelector(("#first_stock")).value.length > 0 && document.querySelector(("#second_stock")).value.length){
    var stock1 = document.querySelector("#first_stock").value;
    var stock2 = document.querySelector("#second_stock").value;
    var like;
    (document.querySelector(("#double_like")).checked) ? like = "true" : like = "false";
    var URL = "/api/stock-prices?stock=" + stock1 + "&stock=" + stock2 + "&like=" + like;
    fetch(URL).then(function(response){
      response.json().then(function(data){
        document.querySelector("#jsonResult").innerHTML = JSON.stringify(data);
      }).catch(function(response){
        alert("No valid response");
      })
    })
  }
}