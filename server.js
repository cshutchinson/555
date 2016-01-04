var http = require('http');
var stopWords = require('./stopwords');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    database : 'words'
  }
})

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
        // processWords()
        // can insert words here after processing
        console.log(processWords(elem.data.title));
      })
    })
  });
}

http.request(options, callback).end();

function processWords(wordsString){
  var tempWords = wordsString.split(' ');
  tempWords = tempWords.map(function(elem){
    return elem.toLowerCase();
  })
  tempWords = removePunctuation(tempWords);
  tempWords = removeEmptyElements(tempWords);
  tempWords = removeStopWords(tempWords, stopWords);
  tempWords = removeSingleCharacters(tempWords);
  return tempWords;
}

function removePunctuation(wordsArray){
  return wordsArray.map(function(elem){
    // return elem.replace(/[.!?'":;\-{},%\d*\[\]]/gi, '');
    return elem.replace(/[\W\d'"*$\[\]]/gi, '');
  })
}

function removeEmptyElements(wordsArray){
  return wordsArray.filter(function(elem){
    return elem !== '';
  })
}

function removeStopWords(wordsArray, stopWords){
  return wordsArray.filter(function(elem){
    return stopWords.indexOf(elem) < 0;
  })
}

function removeSingleCharacters(wordsArray){
  return wordsArray.filter(function(elem){
    return elem.length > 1;
  })
}
