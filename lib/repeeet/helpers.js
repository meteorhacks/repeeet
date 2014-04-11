
Helpers = {}

Helpers.interval = 1000*60*60;
Helpers.getVariations = getVariations;
Helpers.getEmptyVariations = getEmptyVariations;
Helpers.getInterval = getInterval;
Helpers.getDay = getDay;
Helpers.validateTweet = validateTweet;
Helpers.getTweetLength = getTweetLength;

function getVariations (_variations, _settings) {
  var settings = _settings || Defaults.Settings();
  var variations = _variations || [];
  var currentTime = new Date().getTime();
  var interval = getInterval(settings);
  for(var i=settings.repeatCount; i-->0;) {
    if (!variations[i])
      variations[i] = Defaults.Variations();
    variations[i].time = currentTime + interval * i;
  };
  return variations.slice(0, settings.repeatCount)
}

function getEmptyVariations (_variations, _settings) {
  var settings = _settings || Defaults.Settings();
  var variations = _variations || [];
  var currentTime = new Date().getTime();
  var interval = getInterval(settings);
  for(var i=settings.repeatCount; i-->0;) {
    if (!variations[i])
      variations[i] = Defaults.Variations();
    variations[i].time = currentTime + interval * i;
    variations[i].text = null;
  };
  return variations.slice(0, settings.repeatCount)
}

function getInterval (settings) {
  var option = settings.intervalUnitOptions[0];
  for(var i=settings.intervalUnitOptions.length; i-->0;){
    if (settings.intervalUnitOptions[i].title === settings.intervalUnit) {
      return settings.intervalUnitOptions[i].millis*settings.intervalValue;
    };
  };
  return settings.intervalUnitOptions[0].millis*settings.intervalValue;
}

function getDay (ts) {
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var date = new Date(ts);
  var day = date.getDay();
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return days[day] + ' ' + time;
}

function validateTweet (tweet) {
  console.log('validating', tweet);
  if (tweet.defaultText === '')
    return 'Please enter tweet text';
  if (getTweetLength(tweet.defaultText) > 140)
    return 'Tweet is longer than 140 characters';
  for(var i=tweet.variations.length; i-->0;) {
    if (tweet.variations[i].text && getTweetLength(tweet.variations[i].text) > 140)
      return 'Tweet variation number ' + i + ' is longer than 140 characters';
  }
}

function getTweetLength (text) {
  var shortUrl = '_______________________';
  var regEx = /https?:\/\/?[^ ]+/gi;
  var clean = text.replace(regEx, shortUrl);
  return clean.length;
}