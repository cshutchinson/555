var http = require('http');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    database : 'words'
  }
})

var words = [];

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
      knex("posts").insert({
        reddit_id: elem.data.id,
        reddit_name: elem.data.name,
        reddit_title: elem.data.title,
        reddit_created: elem.data.created,
        reddit_url: elem.data.url,
        reddit_created_utc: elem.data.created_utc
      }, "id").then(function(id){
        // console.log('Inserted record: ', id);
      })
      words = words.concat(elem.data.title.split(' '));
    })
    console.log(words.length, words);
  });
}

http.request(options, callback).end();

function splitString(wordString){
  return wordString.split(' ');
}
