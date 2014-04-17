Template.tweetsList.helpers({
  tweets: getTweets
});

Template.tweetsList.events({
  'click .invite-button': setInvitationSettings
});

function getTweets () {
  if (Meteor.userId()) {
    var tweets = Tweets.find({userId: Meteor.userId()}).fetch();
    tweets.sort(hasLatestVariation);
    return tweets;
  };
}

function hasLatestVariation (t1, t2) {
  return (getLatest(t1.variations) < getLatest(t2.variations)) ? -1 : 1;
}

function getLatest(variations) {
  var recent = Number.POSITIVE_INFINITY;
  for(var i=variations.length;i-->0;)
    if(!variations[i].sent && !variations[i].error && variations[i].time < recent)
      recent = variations[i].time;
  return recent;
}

function setInvitationSettings () {
  Session.set('settings', helper.getInviteSettings());
  Session.set('buffer', helper.getInviteTweet());
}
