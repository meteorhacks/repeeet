
Repeeet = {}

Repeeet.interval = 1000*60*60;

Repeeet.getVariations = function (_variations, _settings) {
  var settings = _settings || Defaults.Settings();
  var variations = _variations || [];
  var currentTime = new Date().getTime();
  var interval = Repeeet.getInterval(settings);
  for(var i=settings.repeatCount; i-->0;) {
    if (!variations[i])
      variations[i] = Defaults.Variations();
    variations[i].time = currentTime + interval * i;
  };
  return variations.slice(0, settings.repeatCount)
}

Repeeet.getEmptyVariations = function (_variations, _settings) {
  var settings = _settings || Defaults.Settings();
  var variations = _variations || [];
  var currentTime = new Date().getTime();
  var interval = Repeeet.getInterval(settings);
  for(var i=settings.repeatCount; i-->0;) {
    if (!variations[i])
      variations[i] = Defaults.Variations();
    variations[i].time = currentTime + interval * i;
    variations[i].text = null;
  };
  return variations.slice(0, settings.repeatCount)
}

Repeeet.getInterval = function (settings) {
  var option = settings.intervalUnitOptions[0];
  for(var i=settings.intervalUnitOptions.length; i-->0;){
    if (settings.intervalUnitOptions[i].title === settings.intervalUnit) {
      return settings.intervalUnitOptions[i].millis*settings.intervalValue;
    };
  };
  return settings.intervalUnitOptions[0].millis*settings.intervalValue;
}

Repeeet.getDay = function (ts) {
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var date = new Date(ts);
  var day = date.getDay();
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return days[day] + ' ' + time;
}