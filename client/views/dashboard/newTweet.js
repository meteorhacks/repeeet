Template.newTweet.helpers({
  settings: getSettings,
  buffer: getBuffer,
  variations: getVariations,
  toDay: Repeeet.getDay
});

Template.newTweet.events({
  'click .variations-button': toggleVariations,
  'click .newtweet-repeat-count li': updateRepeatCount,
  'click .newtweet-interval-value li': updateIntervalValue,
  'click .newtweet-interval-unit li': updateIntervalUnit,
  'keydown .newtweet-text': updatePostText,
  'keydown .newtweet-variation': updateVariationText,
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
  buffer.variations = Repeeet.getVariations(null, settings);
  Session.set('buffer', buffer);
}

function resetVariations () {
  var buffer = Session.get('buffer');
  var settings = Session.get('settings');
  buffer.variations = Repeeet.getEmptyVariations(null, settings);
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
  Meteor.defer(function () {
    var buffer = Session.get('buffer');
    var idx = e.target.dataset.index;
    buffer.variations[idx].text = e.target.value;
    if (buffer.variations[idx].text === '')
      buffer.variations[idx].text = null;
    Session.set('buffer', buffer);
  });
}

function postNewTweet () {
  if (Meteor.userId()) {
    Meteor.call('repeeet', Session.get('buffer'));
    Session.set('buffer', Defaults.Tweets());
  } else {
    Meteor.loginWithTwitter();
  };
}
