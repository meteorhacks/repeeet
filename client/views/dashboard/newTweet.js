Template.newTweet.helpers({
  settings: getSettings,
  toDay: getDay
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

function getDay (ts) {
  var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var date = new Date(ts);
  var day = date.getDay();
  var time = date.getHours() + ':' + date.getMinutes();
  return days[day] + ' ' + time;
}

function toggleVariations () {
  if (Meteor.userId()) {
    var settings = Settings.findOne({_id: Meteor.userId()});
    Settings.update(
      {_id: Meteor.userId()},
      {$set: {'buffer.hasVariations': !settings.buffer.hasVariations}}
    );
  };
}

function updatePostText (e) {
  if (Meteor.userId()) {
    Meteor.defer(function () {
      Settings.update(
        {_id: Meteor.userId()},
        {$set: {'buffer.defaultText': e.target.value}}
      );
    });
  };
}

function postNewTweet () {
  if (Meteor.userId()) {
    var settings = Settings.findOne({_id: Meteor.userId()});
    Tweets.insert(settings.buffer);
    Settings.update(
      {_id: Meteor.userId()},
      {$set: {buffer: Defaults.Tweets(Meteor.userId())}}
    );
  };
}

function updateRepeatCount (e) {
  if (Meteor.userId()) {
    var count = parseInt(e.target.innerText);
    Settings.update(
      {_id: Meteor.userId()},
      {$set: {
          'buffer.variations': recalculateVariations(count),
          'profile.repeatCount': count
        }
      }
    );
  };
}

function updateIntervalValue (e) {
  if (Meteor.userId()) {
    var interval = parseInt(e.target.innerText);
    Settings.update(
      {_id: Meteor.userId()},
      {$set: {
          'buffer.variations': recalculateVariations(null, interval),
          'profile.intervalValue': interval
        }
      }
    );
  };
}

function updateIntervalUnit (e) {
  if (Meteor.userId()) {
    var unit = e.target.innerText;
    Settings.update(
      {_id: Meteor.userId()},
      {$set: {
          'buffer.variations': recalculateVariations(null, null, unit),
          'profile.intervalUnit': unit
        }
      }
    );
  };
}

function recalculateVariations (_count, _interval, _unit) {
  var settings = Settings.findOne({_id: Meteor.userId()});
  var count = _count || settings.profile.repeatCount;
  var unit = _unit || settings.profile.intervalUnit;
  var interval = _interval || settings.profile.intervalValue;
  var variations = settings.buffer.variations;
  var intervalUnitOpt = settings.profile.intervalUnitOptions[0];
  var date = new Date();
  for (var i=0; i<settings.profile.intervalUnitOptions.length; ++i) {
    var _currentIntervalUnit = settings.profile.intervalUnitOptions[i];
    if (unit === _currentIntervalUnit.title) {
      intervalUnitOpt = _currentIntervalUnit;
      break;
    };
  }
  for (var i=0; i<count; ++i) {
    if (!variations[i]) {
      variations[i] = {
        text: false,
        time: date.getTime() + intervalUnitOpt.minutes*interval*i,
        enabled: true
      };
    } else {
      variations[i].time = date.getTime() + intervalUnitOpt.minutes*interval*i;
    };
  }
  return variations.slice(0, count);
}
