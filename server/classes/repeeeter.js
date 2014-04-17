Repeeeter = function (opt) {
  var self = this;
  opt = opt || {};
  
  this.tweeter = opt.tweeter || new Tweeter(opt);
  
  this.tweet = function (tweet, index) {
    console.log('<== Repeeeter: tweet ', helper.getTweetString(tweet), index, '==>');
    var text = tweet.variations[index].text || tweet.text;
    self.tweeter.tweet(tweet.userId, text, function (err) {
      if (!err) {
        tweet.variations[index].sent = true;
        Tweets.update({_id: tweet._id}, {$set: {variations: tweet.variations}});
        console.log('<== Repeeeter: tweet ', helper.getTweetString(tweet), index, ' success ', '==>');
      } else {
        tweet.variations[index].sent = false;
        tweet.variations[index].error = err;
        Tweets.update({_id: tweet._id}, {$set: {variations: tweet.variations}});
        console.log('<== Repeeeter: tweet ', helper.getTweetString(tweet), index, ' failed ', err, '==>');
      }
    });
  }
}
