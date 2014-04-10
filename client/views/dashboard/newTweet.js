Template.newTweet.helpers({
  settings: getSettings,
  toDay: Repeeet.getDay
});

Template.newTweet.events({
  'click .variations-button': toggleVariations,
  'keydown .newtweet-text': updatePostText,
  'click .newtweet-post': postNewTweet,
  'click .newtweet-repeat-count li': updateRepeatCount,
  'click .newtweet-interval-value li': updateIntervalValue,
  'click .newtweet-interval-unit li': updateIntervalUnit,
});

function getSettings () {
  if (Meteor.userId()) {
    return Settings.findOne({_id: Meteor.userId()});
  };
}

function toggleVariations () {
  if (Meteor.userId()) {
    var settings = Settings.findOne({_id: Meteor.userId()});
    settings.buffer.hasVariations = !settings.buffer.hasVariations;
    Settings.update( {_id: Meteor.userId()}, settings);
  };
}

function updatePostText (e) {
  if (Meteor.userId()) {
    Meteor.defer(function () {
      var settings = Settings.findOne({_id: Meteor.userId()});
      settings.buffer.variations = Repeeet.recalculateVariations();
      settings.buffer.defaultText = e.target.value();
      Settings.update( {_id: Meteor.userId()}, settings);
    });
  };
}

function postNewTweet () {
  if (Meteor.userId()) {
    var settings = Settings.findOne({_id: Meteor.userId()});
    settings.buffer.variations = Repeeet.recalculateVariations();
    settings.buffer.userId = Meteor.userId();
    Settings.update( {_id: Meteor.userId()}, settings);
    Tweets.insert(settings.buffer);
  };
}

function updateRepeatCount (e) {
  if (Meteor.userId()) {
    var count = parseInt(e.target.innerText);
    settings.profile.repeatCount = count;
    settings.buffer.variations = Repeeet.recalculateVariations(count);
    Settings.update( {_id: Meteor.userId()}, settings);
  };
}

function updateIntervalValue (e) {
  if (Meteor.userId()) {
    var interval = parseInt(e.target.innerText);
    settings.profile.intervalValue = interval;
    settings.buffer.variations = Repeeet.recalculateVariations(null, interval);
    Settings.update( {_id: Meteor.userId()}, settings);
  };
}

function updateIntervalUnit (e) {
  if (Meteor.userId()) {
    var unit = e.target.innerText;
    settings.profile.intervalUnit = unit;
    settings.buffer.variations = Repeeet.recalculateVariations(null, null, unit);
    Settings.update( {_id: Meteor.userId()}, settings);
  };
}
