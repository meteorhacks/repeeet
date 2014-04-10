
Repeeet = {}

Repeeet.recalculateVariations = function (_count, _interval, _unit) {
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
        time: date.getTime() + intervalUnitOpt.millis*interval*i,
        enabled: true
      };
    } else {
      variations[i].time = date.getTime() + intervalUnitOpt.millis*interval*i;
    };
  }
  return variations.slice(0, count);
}

Repeeet.getDay = function (idx) {
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var date = new Date(ts);
  var day = date.getDay();
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return days[day] + ' ' + time;
}