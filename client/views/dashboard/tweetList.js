Template.tweetsList.helpers({
  tweets: function () {
    if (Meteor.userId()) {
      return Tweets.find({userId: Meteor.userId()});
    };
  }
});
