# google_sentiment_analysis
Node project to simulate sentiment analysis using google sentiment analysis

### Prerequisites 
> Ensure latest node.js is installed 
> Create a project in [google] cloud developer and enable NLApi
> Prepare google.json downloading from the created project
> Create a project in  [twitter](https://apps.twitter.com/)
> Prepare a twitter.json in below format

```json
{
  "consumer_key": "",
  "consumer_secret": "",
  "access_token_key": "",
  "access_token_secret": ""
}
```

### Install Dependencies
###### Below Process should end with 'npm ok'
```javascript
npm install -d
```
 

### Execute Process
```javascript 
npm run dev
```

### References 
[Google Cloud](https://cloud.google.com/natural-language/docs/basics)
[Code Burst](https://codeburst.io/building-a-realtime-twitter-sentiment-dashboard-with-firebase-and-nlp-7064bb30f5ab)
[Code Burst 2](https://medium.com/google-cloud/comparing-tweets-about-trump-hillary-with-natural-language-processing-a0064e949666)
[node - twitter](https://github.com/desmondmorris/node-twitter/tree/master/examples#search)