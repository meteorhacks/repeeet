Meteor.publish('tweets', function() {
  if (this.userId) {
    return Tweets.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('currentUser', function() {
  if(this.userId) {
    return Meteor.users.find(this.userId);
  } else {
    this.ready();
  }
});
