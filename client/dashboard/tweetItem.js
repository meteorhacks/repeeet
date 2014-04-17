
Template.tweetItem.helpers({
  toDay: helper.getDay,
  text: getDisplayText,
  variations: getVariations,
});

Template.tweetItem.events({
  'click .tweet-delete': deleteTweet,
  'click .variation-time-button': setVisibleVariation
});

function deleteTweet (e) {
  var self = this;
  $(e.target).parents('.modal').modal('hide');
  $(e.target).parents('.tweet-item').hide();
  Meteor.setTimeout(function () {
    Meteor.call('remove', self._id);
  }, 1000);
}

function getDisplayText () {
  var text = Session.get(this._id) || this.text;
  var textWithLinks = helper.formatTweetText(text);
  return textWithLinks;
}

function getVariations () {
  var variations = this.variations;
  for(var i=variations.length; i-->0;) {
    variations[i].__index = i;
    variations[i].__tweet = this;
  }
  variations[0].selected = true;
  return variations;
}

function setVisibleVariation (e) {
  var els = e.target.parentElement.getElementsByClassName('variation-time-button');
  for(var i=els.length; i-->0;) els[i].classList.remove('selected');
  e.target.classList.add('selected');
  Session.set(this.__tweet._id, this.text || this.__tweet.text);
}
