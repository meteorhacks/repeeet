
// var check_interval = 1000 * 60 * 60;
var check_interval = 1000 * 30;

Meteor.setInterval(postman, check_interval);
Meteor.setTimeout(postman, 0);

function postman () {
  var timeLimit = new Date().getTime() + check_interval;
  console.log('[*] timeLimit');
  console.log(timeLimit);
  var tweets = Tweets.find({"variations": {$elemMatch: {enabled: true, time: {$lt: timeLimit}}}}).fetch();
  var variations = getVariations(tweets, timeLimit);
  variations.forEach(scheduleTweet);
  console.log('[*] variations');
  console.log(variations);
}

function getVariations (tweets, timeLimit) {
  var variations = [];
  for(var i=0; i<tweets.length; ++i) {
    var tweet = tweets[i];
    for(var j=0; j<tweet.variations.length; ++j) {
      var variation = tweet.variations[j];
      var nowTime = new Date().getTime();
      var scheduleTime = (variation.time > nowTime) ? variation.time - nowTime : 0;
      if (variation.enabled && variation.time < timeLimit) {
        variations.push({
          index: j,
          tweet: tweet,
          text: variation.text || tweet.defaultText,
          time: scheduleTime
        });
      };
    }
  }
  return variations;
}

function scheduleTweet (variation) {
  console.log('[*] scheduling');
  console.log(variation.time);
  Meteor.setTimeout(function () {
    var twit = getTwitter(variation.tweet);
    var resp = Async.runSync(function (done) {
      twit.post('statuses/update', { status: variation.text + new Date().toString() }, done);
    });
    if (!resp.error) {
      variation.tweet.variations[variation.index].enabled = false;
      var params = {variations: variation.tweet.variations};
      Tweets.update({_id: variation.tweet._id}, {$set: params});
    };
  }, variation.time);
}

function getTwitter (tweet) {
  var Twit = Meteor.require('twit');
  var params = Accounts.loginServiceConfiguration.findOne({service: 'twitter'});
  var user = Meteor.users.findOne({_id: tweet.userId});
  return new Twit({
    consumer_key : params.consumerKey,
    consumer_secret : params.secret,
    access_token : user.services.twitter.accessToken,
    access_token_secret : user.services.twitter.accessTokenSecret
  });
}
