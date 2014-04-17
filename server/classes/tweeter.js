Tweeter = function (opt) {
  var self = this;
  opt = opt || {};
  
  this.Twit = opt.Twit || Meteor.require('twit');
  this.Future = opt.Future || Npm.require('fibers/future');
  this.maxRetries = opt.maxRetries || 5;
  this.baseTimeout = opt.baseTimeout || 1000*5;
  this.maxTimeout = opt.maxTimeout || 1000*60;
  
  this.tweet = function (userId, text, callback) {
    console.log('<== Tweeter: tweet ', userId, text, '==>');
    var twit = this.getTwit(userId);
    var future = new this.Future();
    var retries = 0;
    var retry = new Retry({baseTimeout: this.baseTimeout, maxTimeout: this.maxTimeout});
    Meteor.bindEnvironment(postTweet, postTweetCallback)();
    return future.wait();
    
    function postTweet () {
      console.log('<== Tweeter: post ', userId, text, '==>');
      var resp = Async.runSync(function (done) {
        twit.post('statuses/update', {status: text}, done);
      });
      postTweetCallback(resp.error);
    }
    
    function postTweetCallback (err) {
      if(!err) {
        return callback();
      }
      console.log('<== Tweeter: error ', userId, text, err, '==>');
      if (err.statusCode === 403) {
        callback('user error');
      }
      if (retries < self.maxRetries) {
        console.log('<== Tweeter: retry ', userId, text, retries, '==>');
        retry.retryLater(++retries, postTweet);
      } else {
        console.log('<== Tweeter: giving up ', userId, text, '==>');
        future.return(true);
        callback('timeout');
      };
    }
  }
  
  this.getTwit = function (userId) {
    var user = Meteor.users.findOne({_id: userId}) || {services:{twitter:{}}};
    var params = Accounts.loginServiceConfiguration.findOne({service: 'twitter'}) || {};
    return new this.Twit({
      consumer_key : params.consumerKey,
      consumer_secret : params.secret,
      access_token : user.services.twitter.accessToken,
      access_token_secret : user.services.twitter.accessTokenSecret
    });
  }
}
