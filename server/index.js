Meteor.methods({
  repeeet: repeeet,
  remove: remove
});

function repeeet (tweet) {
  var error = Helpers.validateTweet(tweet);
  if (!error) {
    return Scheduler.add(tweet, this.userId);
  };
}

function remove (tweetId) {
  var tweet = Tweets.findOne({_id: tweetId});
  if (tweet && this.userId && tweet.userId === this.userId) {
    Tweets.remove({_id: tweetId});
  }
}

Meteor.startup(function () {
  Scheduler.start(1000*60*60);
})
