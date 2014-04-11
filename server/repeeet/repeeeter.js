Repeeeter = {}
Repeeeter.tweet = tweet;

function tweet (tweet, index) {
  var twit = getTwit(tweet);
  var text = tweet.variations[index].text || tweet.defaultText;
  var Future = Npm.require('fibers/future');
  var retry = new Retry({baseTimeout: 5*1000, maxTimeout: 1000*60});
  var retries = 0;
  var f = new Future();
  var tweetNow = Meteor.bindEnvironment(_tweetNow, function(err) { throw err })
  tweetNow();
  return f.wait();

  function _tweetNow () {
    var resp = Async.runSync(function (done) {
      console.log('===>>> repeeet: tweeting: ', tweet, index);
      twit.post('statuses/update', {status: text}, done);
    });
    if (!resp.error) {
      updateDatabase(tweet);
    } else {
      handleError(resp.error);
    }
  }

  function updateDatabase () {
    tweet.variations[index].enabled = false;
    Tweets.update({_id: tweet._id}, {$set: {variations: tweet.variations}});
    f.return(null);
  }

  function handleError (error) {
    console.log('===>>> repeeet: error', error, tweet.variations[index]);
    if (error.statusCode === 403) {
      // Show Error
    };
    if (retries < 5) {
      retry.retryLater(++retries, tweetNow);
    } else {
      console.log('Reached max retries');
      f.return(true);
    };
  }
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
