var handlers = {};

//sample route
handlers.hello = function (data, callback) {
  // respond with status code and a data object
  callback(200,
    {
      'message': 'Hello World!'
    })
}

//not found route
 handlers.notFound = function (data, callback) {
  callback(404,
    {
      'message' : 'No such route found'
    });
}

handlers.ping = function (data, callback) {
 callback(200);
}

//define router
var router = {
  'hello' : handlers.hello,
  'notFound' : handlers.notFound,
  'ping' : handlers.ping
};

module.exports = router;
