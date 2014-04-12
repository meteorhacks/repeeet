Template.tweetsList.helpers({
  tweets: getTweets
});

function getTweets () {
  if (Meteor.userId()) {
    var tweets = Tweets.find({userId: Meteor.userId()}).fetch();
    console.log(JSON.stringify(tweets));
    tweets.sort(hasLatestVariation);
    console.log(JSON.stringify(tweets));
    return tweets;
  };
}

function hasLatestVariation (t1, t2) {
  return (getLatest(t1.variations) < getLatest(t2.variations)) ? -1 : 1;
}

function getLatest(variations) {
  var recent = Number.POSITIVE_INFINITY;
  for(var i=variations.length;i-->0;)
    if(variations[i].enabled && variations[i].time < latest)
      recent = variations[i].time;
  return latest;
}
