var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var router = require('./router');
var fs = require('fs');

var http_server = http.createServer(function(req, res){
  unified_server(req, res);
});

//https server options
var https_options = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

var https_server = https.createServer(https_options, function(req, res){
    unified_server(req, res);
});

//starting the http server
http_server.listen(config.httpPort, function(){
  console.log("HTTP Server is running on port " + config.httpPort + ' on ' + config.envName);
});

//starting the http_server server
https_server.listen(config.httpsPort, function(){
  console.log("HTTPS Server is running on port " + config.httpsPort + ' on ' + config.envName);
});


var unified_server = function(req, res){
  //get req path
  var parsedUrl = url.parse(req.url, true);
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  //get request method
  var method = req.method.toLowerCase();

  //Get Query String
  var queryStringObject = parsedUrl.query;

  //get headers as an object
  var headers = req.headers;

  //parse payload
  var decoder = new StringDecoder('utf-8');
  var reqBody = '';

  //append data on emmintting data event
  req.on('data', function(data){
      reqBody += decoder.write(data);
  });

  //end event
  req.on('end', function () {
    reqBody += decoder.end();

    //choose the handlers
    var chosenHandler = typeof(router[path]) !== 'undefined'
      ? router[path] : router['notFound'];

    //Construct data object
    var data = {
      path,
      queryStringObject,
      method,
      reqBody,
      headers
    };

    //route the request to the specified handler
    chosenHandler(data, function(statusCode, payload){
      //use the status code 200 by default or actual status code
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // use payload as actual or default as empty
      payload = typeof(payload) == 'object' ? payload : {};
      var payloadString = JSON.stringify(payload);

      //return the response
      res.setHeader('content-type', 'application/json')
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("The response is ", statusCode, payloadString);
    });
  });
}
