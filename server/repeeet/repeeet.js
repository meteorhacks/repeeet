Meteor.methods({
  repeeet: repeeet,
  remove: remove
});

function repeeet (tweet) {
  console.log('===>>> repeeet');
  if (!tweet._id) {
    tweet.userId = this.userId;
    tweet._id = Tweets.insert(tweet);
  }
  var twit = getTwit(tweet);
  var currentTime = new Date().getTime();
  tweet.variations.forEach(function (variation, idx) {
    var timeRemaining = (variation.time > currentTime) ? variation.time - currentTime : 0;
    if (variation.enabled && timeRemaining < currentTime + Repeeet.interval)
      console.log('===>>> repeeet: variation');
      console.log(variation);
      Meteor.setTimeout(function () {
        tweetNow(twit, tweet, idx);
      }, timeRemaining)
  });
}

function remove (tweetId) {
  var tweet = Tweets.findOne({_id: tweetId});
  if (tweet && this.userId && tweet.userId === this.userId) {
    Tweets.remove({_id: tweetId});
  }
}

function tweetNow (twit, tweet, idx) {
  var text = tweet.variations[idx].text || tweet.defaultText;
  if (text ==='') text = tweet.defaultText;
  var resp = Async.runSync(function (done) {
    var debugInfo = ' target('+new Date(tweet.variations[idx].time).toString()+') current('+new Date().toString()+')';
    console.log('===>>> repeeet: tweeting: ' + debugInfo);
    console.log(tweet.variations[idx]);
    twit.post('statuses/update', {status: text + debugInfo}, done);
    // twit.post('statuses/update', {status: text}, done);
  });
  if (!resp.error) {
    console.log('===>>> repeeet: success');
    console.log(tweet.variations[idx]);
    tweet.variations[idx].enabled = false;
    Tweets.update({_id: tweet._id}, {$set: {variations: tweet.variations}});
  } else {
    console.log('===>>> repeeet: error');
    console.log(resp.error);
  };
}

function getTwit (tweet) {
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
