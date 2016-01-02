var http = require('http');

var options = {
  host: 'www.reddit.com',
  path: '/r/all/.json'
};
callback = function(response) {
  var str = '';
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });
  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    JSON.parse(str).data.children.forEach(function(elem, index){
      console.log(index, elem.data.title)
    })
  });
}

http.request(options, callback).end();
