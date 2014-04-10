Template.tweetItem.helpers({
  toDay: Repeeet.getDay
});

Template.tweetItem.events({
  'click .tweet-delete': deleteTweet,
  'click .variation-time-button': showVariation
});

function showVariation (e) {
  alert(JSON.stringify(this));
}

function deleteTweet (e) {
  Meteor.call('remove', this._id);
}
