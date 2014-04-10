Meteor.publish('tweets', function() {
  if (this.userId) {
    return Tweets.find({userId: this.userId});
  } else {
    this.ready();
  }
});
