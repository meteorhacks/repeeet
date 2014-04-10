Template.tweetItem.helpers({
  toDay: Repeeet.getDay
});

Template.tweetItem.events({
  'click .tweet-delete': deleteTweet
});

function deleteTweet (e) {
  Tweets.remove({_id: this._id});
}
