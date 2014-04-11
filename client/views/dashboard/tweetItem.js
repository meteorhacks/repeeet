Template.tweetItem.helpers({
  toDay: Helpers.getDay
});

Template.tweetItem.events({
  'click .variation-time-button': showVariation,
  'click .tweet-delete': deleteTweet
});

function showVariation (e) {
  alert(JSON.stringify(this));
}

function deleteTweet (e) {
  $(e.target).parents('.modal').modal('hide');
  $(e.target).parents('.tweet-item').hide();
  var self = this;
  Meteor.setTimeout(function () {
    Meteor.call('remove', self._id);
  }, 1000);
}
