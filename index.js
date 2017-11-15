// Imports the Google Cloud client library
const language = require('@google-cloud/language');
const Twitter = require('twitter');

const callNlApi = (text = 'Barika is a good boy but he is a bad cricketer')=>{
// Instantiates a client
const client = new language.LanguageServiceClient();

const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

// Detects the sentiment of the text
client
  .analyzeSentiment({document: document})
  .then(results => {
    const sentiment = results[0].documentSentiment;

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}


//Get the tweets from twitter 
const getTweets = (searchTerms = '#iPhone7') =>{
    const config = require('./twitter.json');
    const client = new Twitter(config);

    client.get('search/tweets', {q: searchTerms}, function(error, tweets, response) {
      console.log(tweets.statuses[0].text);
      callNlApi(tweets.statuses[0].text);
   });

    // client.stream('statuses/filter', {track: searchTerms, language:'en'},  function(stream) {
    //   stream.on('data', function(tweet) {
    //     console.log(tweet.text);
    //   });
    
    //   stream.on('error', function(error) {
    //     console.log(error);
    //   });
    // });
}

getTweets('#padmavati');