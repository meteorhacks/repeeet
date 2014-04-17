TweetHelper = TweetHelperClass;
helper = new TweetHelper();

function TweetHelperClass () {
  var self = this;
  
  this.getDefaultTweet = function () {
    return {
      userId: null,
      text: '',
      date: new Date().getTime(),
      variations: this.getVariations(null, this.getDefaultSettings())
    };
  }
  
  this.getDefaultVariation = function () {
    return {
      text: null,
      time: null,
      sent: false,
      error: null
    }
  }
  
  this.getDefaultSettings = function () {
    return {
      repeatCount: 2,
      repeatCountOptions: _.range(1, 5),
      intervalValue: 12,
      intervalValueOptions: _.range(1, 13),
      intervalUnit: 'Hours',
      hasVariations: false,
      intervalUnitOptions: [
        {title: 'Minutes', millis: 1000*60},
        {title: 'Hours', millis: 1000*60*60},
        {title: 'Days', millis: 1000*60*60*24},
        {title: 'Weeks', millis: 1000*60*60*24*7}
      ]
    };
  };
  
  this.getInviteTweet = function () {
    return {
      userId: null,
      text: 'Repeeet tweet easily with http://www.repeeet.com “Trust me and try repeating your tweets” - Guy Kawasaki',
      date: new Date().getTime(),
      variations: this.getVariations(null, this.getInviteSettings())
    };
  }
    
  this.getInviteSettings = function () {
    var settings = this.getDefaultSettings();
    settings.repeatCount = 4;
    settings.intervalValue = 8;
    settings.intervalUnit = 'Hours';
    return settings;
  };
  
  this.getTweetString = function (tweets) {
    var result = [];
    if(!Array.isArray(tweets)) tweets = [tweets];
    for(var i=0; i<tweets.length; ++i) {
      var tweet = tweets[i];
      tweet._id = tweet._id || '<--no-id-->';
      tweet.text = tweet.text || '<--no-text-->';
      result.push({id: tweet._id, text: tweet.text});
    }
    return JSON.stringify(result);
  }

  this.getVariations = function (_variations, _settings) {
    var settings = _settings || this.getDefaultSettings();
    var variations = _variations || [];
    var currentTime = new Date().getTime();
    var interval = this.getInterval(settings);
    for(var i=settings.repeatCount; i-->0;) {
      if (!variations[i])
        variations[i] = this.getDefaultVariation();
      variations[i].time = currentTime + interval * i;
    };
    return variations.slice(0, settings.repeatCount)
  }

  this.getEmptyVariations = function (_variations, _settings) {
    var settings = _settings || this.getDefaultSettings();
    var variations = _variations || [];
    var currentTime = new Date().getTime();
    var interval = this.getInterval(settings);
    for(var i=settings.repeatCount; i-->0;) {
      if (!variations[i])
        variations[i] = this.getDefaultVariation();
      variations[i].time = currentTime + interval * i;
      variations[i].text = null;
    };
    return variations.slice(0, settings.repeatCount)
  }

  this.getInterval = function (settings) {
    var option = settings.intervalUnitOptions[0];
    for(var i=settings.intervalUnitOptions.length; i-->0;){
      if (settings.intervalUnitOptions[i].title === settings.intervalUnit) {
        return settings.intervalUnitOptions[i].millis*settings.intervalValue;
      };
    };
    return settings.intervalUnitOptions[0].millis*settings.intervalValue;
  }

  this.getDay = function (ts) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var date = new Date(ts);
    var day = date.getDay();
    var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return days[day] + ' ' + time;
  }

  this.validateTweet = function (tweet) {
    if (tweet.text === '')
      return 'Please enter tweet text';
    if (this.getTweetLength(tweet.text) > 140)
      return 'Tweet is longer than 140 characters';
    for(var i=tweet.variations.length; i-->0;) {
      if (tweet.variations[i].text && this.getTweetLength(tweet.variations[i].text) > 140)
        return 'Tweet variation number ' + i + ' is longer than 140 characters';
    }
  }

  this.getTweetLength = function (text) {
    var shortUrl = '_______________________';
    var regEx = /https?:\/\/?[^ ]+/gi;
    var clean = text.replace(regEx, shortUrl);
    return clean.length;
  }
}
