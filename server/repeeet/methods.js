Meteor.methods({
  repeeet: function (tweet) {
    console.log('<== method: repeeet ', tweet, '==>');
    var error = helper.validateTweet(tweet);
    tweet.userId = this.userId;
    if (!error) scheduler.add(tweet);
  },
  
  remove: function (tweetId) {
    console.log('<== method: remove ', tweetId, '==>');
    var tweet = Tweets.findOne({_id: tweetId});
    if (tweet && this.userId && tweet.userId === this.userId) {
      Tweets.remove({_id: tweetId});
    }
  }
});
