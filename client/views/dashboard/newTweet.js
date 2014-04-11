Template.newTweet.helpers({
  settings: getSettings,
  buffer: getBuffer,
  length: getLength,
  variations: getVariations,
  toDay: Helpers.getDay
});

Template.newTweet.events({
  'click .variations-button': toggleVariations,
  'click .newtweet-repeat-count li': updateRepeatCount,
  'click .newtweet-interval-value li': updateIntervalValue,
  'click .newtweet-interval-unit li': updateIntervalUnit,
  'keydown .newtweet-text': updatePostText,
  'paste .newtweet-text': updatePostText,
  'keydown .newtweet-variation': updateVariationText,
  'paste .newtweet-variation': updateVariationText,
  'click .newtweet-post': postNewTweet
});

Meteor.startup(function () {
  Session.setDefault('settings', Defaults.Settings());
  Session.setDefault('buffer', Defaults.Tweets());
})

function getSettings () {
  return Session.get('settings');
}

function getBuffer () {
  return Session.get('buffer');
}

function getLength () {
  var tweet = Session.get('buffer');
  var index = this.__index;
  if (index !== undefined && tweet.variations[index].text) {
    return Helpers.getTweetLength(tweet.variations[index].text);
  } else {
    return Helpers.getTweetLength(tweet.defaultText);
  }
}

function getVariations () {
  var buffer = Session.get('buffer');
  for(var i=buffer.variations.length;i-->0;)
    buffer.variations[i].__index = i;
  return buffer.variations;
}

function toggleVariations () {
  var settings = Session.get('settings');
  settings.hasVariations = !settings.hasVariations;
  if (!settings.hasVariations)
    resetVariations();
  Session.set('settings', settings);
}

function updateRepeatCount (e) {
  var settings = Session.get('settings');
  settings.repeatCount = parseInt(e.target.innerText);
  Session.set('settings', settings);
  updateVariations();
}

function updateIntervalValue (e) {
  var settings = Session.get('settings');
  settings.intervalValue = parseInt(e.target.innerText);
  Session.set('settings', settings);
  updateVariations();
}

function updateIntervalUnit (e) {
  var settings = Session.get('settings');
  settings.intervalUnit = e.target.innerText;
  Session.set('settings', settings);
  updateVariations();
}

function updateVariations () {
  var buffer = Session.get('buffer');
  var settings = Session.get('settings');
  buffer.variations = Helpers.getVariations(null, settings);
  Session.set('buffer', buffer);
}

function resetVariations () {
  var buffer = Session.get('buffer');
  var settings = Session.get('settings');
  buffer.variations = Helpers.getEmptyVariations(null, settings);
  Session.set('buffer', buffer);
}

function updatePostText (e) {
  Meteor.defer(function () {
    var buffer = Session.get('buffer');
    buffer.defaultText = e.target.value;
    Session.set('buffer', buffer);
  });
}

function updateVariationText (e) {
  var self = this;
  Meteor.defer(function () {
    var buffer = Session.get('buffer');
    var idx = self.__index;
    buffer.variations[idx].text = e.target.value;
    if (buffer.variations[idx].text === '')
      buffer.variations[idx].text = null;
    Session.set('buffer', buffer);
  });
}

function postNewTweet () {
  if (Meteor.userId()) {
    var tweet = Session.get('buffer');
    var error = Helpers.validateTweet(tweet);
    if (!error) {
      Meteor.call('repeeet', tweet);
      Session.set('buffer', Defaults.Tweets());
    } else {
      // TODO Improve error display
      alert(error);
    };
  } else {
    Meteor.loginWithTwitter();
  };
}
