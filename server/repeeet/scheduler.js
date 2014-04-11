var clock;
var interval;
var lastFetchTime;

Scheduler = {}
Scheduler.add = addNewTweet;
Scheduler.start = start;
Scheduler.stop = stop;

function stop () {
  Meteor.clearInterval(clock);
}

function start (_interval) {
  if (_interval) interval = _interval;
  Meteor.clearInterval(clock);
  clock = Meteor.setInterval(tick, interval);
  tick();
}

function addNewTweet (tweet, userId) {
  tweet.userId = userId;
  if (!tweet._id) {
    tweet._id = Tweets.insert(tweet);
    tweet.date = new Date().getTime();
  };
  Repeeeter.tweet(tweet, 0);
  addTweet(tweet);
  return tweet._id;
}

function addTweet (tweet) {
  // Ignore tweet on index '0' as it gets tweeted earlier
  for(var i=tweet.variations.length;i-->1;){
    if (tweet.variations[i].enabled && tweet.variations[i].time < lastFetchTime + interval) {
      var timeout = tweet.variations[i].time - new Date().getTime();
      Meteor.setTimeout(function () {
        Repeeeter.tweet(tweet, i);
        console.log('===>>> scheduling: ',tweet.variations[i], timeout);
      }, timeout);
    };
  }
}

function tick () {
  lastFetchTime = new Date().getTime();
  var timeLimit = lastFetchTime + interval;
  var tweets = Tweets.find({"variations": {$elemMatch: {enabled: true, time: {$lt: timeLimit}}}}).fetch();
  console.log('===>>> Scheduler: Found '+tweets.length+' tweet(s)');
  tweets.forEach(addTweet);
}
