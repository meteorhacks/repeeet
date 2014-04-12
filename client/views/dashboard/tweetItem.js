
Template.tweetItem.helpers({
  toDay: Helpers.getDay,
  text: getDisplayText,
  variations: getVariations,
});

Template.tweetItem.events({
  'click .tweet-delete': deleteTweet,
  'click .variation-time-button': setVisibleVariation
});

function deleteTweet (e) {
  $(e.target).parents('.modal').modal('hide');
  $(e.target).parents('.tweet-item').hide();
  var self = this;
  Meteor.setTimeout(function () {
    Meteor.call('remove', self._id);
  }, 1000);
}

function getDisplayText () {
  console.log('GET', this);
  return Session.get(this._id) || this.defaultText;
}

function getVariations () {
  var variations = this.variations;
  for(var i=variations.length; i-->0;) {
    variations[i].__index = i;
    variations[i].__tweet = this;
  }
  return variations;
}

function setVisibleVariation (e) {
  Session.set(this.__tweet._id, this.text || this.__tweet.defaultText);
}
