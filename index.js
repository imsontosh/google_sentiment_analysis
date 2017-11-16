// Imports the Google Cloud client library
const language = require('@google-cloud/language');
const Twitter = require('twitter');
const firebase = require('firebase-admin');

const serviceAccount = require('./firebase.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://nlp-e749c.firebaseio.com'
});
  // Instantiates a client
const client = new language.LanguageServiceClient();


// Method to Save to FB
const saveToFB = obj => {
  // console.log('Writing file to Fb', JSON.stringify(obj, null, ''));
  const sentimentRef = firebase.database().ref('sentiment');
  sentimentRef.push(obj, function(error) {
    if (error) throw new Error('Error while saving the data');
    else console.log('Data Saved');
  });
};

//Method to execute NLP API
const callNlApi = (text) => {
  if(!text){
    console.log('No text for Analysis');
    return false;
  }
      const document = {
      content: text,
      type: 'PLAIN_TEXT'
};
  // Detects the sentiment of the text
  return client
    .analyzeSentiment({ document: document });
};

//Create promise for parallel execution

const getPromiseList=(tweets)=>{
  return tweets.map(tweet => {
     return callNlApi(tweet.text);
  });
}

const findEmotion = (score)=>{
  if(score>=0.25 && score<=1.0){
    return 'positive';
  }else if(score>-0.25 && score<0.25){
    return 'neutral';
  }else if(score < 0 && score>-1.0 && score<-0.25){
    return 'negative';
  }
}

const executeAnalysis =(filteredTweet)=>{
  const promiseList = getPromiseList(filteredTweet);
      Promise.all(promiseList).then(([...args])=>{
        const reqData = args.map((results,index)=>{
              const sentiment = results[0].documentSentiment;
              return{
                text: filteredTweet[index].text,
                score: sentiment.score,
                magnitude: sentiment.magnitude,
                emotion: findEmotion(sentiment.score)
              };
        });
  
        const temp = {data:{}};
        reqData.forEach((element, index)=>{
          temp.data[index] = element;
        })
        saveToFB(temp);
        
      }).catch((error)=>{
        console.log(error);
      });
}

const readFromJson=()=>{
  const data = require('./dataset.json');
  executeAnalysis(data.review);
}

//Get the tweets from twitter
const getTweets = (searchTerms = '#iPhone7') => {
  const config = require('./twitter.json');
  const client = new Twitter(config);

  // client.get('search/tweets', { q: searchTerms, language:'en' }, function(error, tweets, response) {
  //   //Filter the language for english only

  //   const filteredTweet = tweets.statuses.filter((tweet)=>{
  //     return tweet.lang == 'en';
  //   });
  //   console.log(`Tweets Analyzed are ${filteredTweet.length} tweets`);

  //   //Execure Promise in parallel
  //   executeAnalysis(filteredTweet);
  // });

  client.stream('statuses/filter', {track: searchTerms, language:'en'},  function(stream) {
    stream.on('data', function(tweet) {
      console.log(tweet.text);
      executeAnalysis([{
        "text": tweet.text
      }]);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });
};

// getTweets('#padmavati');
readFromJson();
