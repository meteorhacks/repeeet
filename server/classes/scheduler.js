
RepeeetScheduler = function (opt) {
  var self = this;
  opt = opt || {};
  
  this.task = opt.task || function(){};
  this.timer = new Timer(_.extend(opt, {run: schedule}));
  
  this.add = function (tweet) {
    if (!tweet._id) tweet = updateDatabase(tweet);
    scheduleVariation(tweet, 0);
    scheduleTweet(tweet);
    return tweet;
  }
  
  this.fetch = function () {
    return Tweets.find(
      {"variations": {$elemMatch: {sent: false, error: null, time: {$lt: self.timer.timeLimit()}}}},
      {"variations": {$elemMatch: {sent: false, error: null, time: {$lt: self.timer.timeLimit()}}}}
    ).fetch();
  }
  
  this.start = function () {
    this.timer.start();
  }
  
  this.stop = function () {
    this.timer.stop();
  }
  
  function updateDatabase (tweet) {
    tweet.date = new Date().getTime();
    tweet._id = Tweets.insert(tweet);
    return tweet;
  }
                                  
  function schedule() {
    var tweets = self.fetch();
    console.log('<== Scheduler: fetched ', helper.getTweetString(tweets), self.timer.timeLimit(), '==>');
    tweets.forEach(scheduleTweet);
  }
  
  function scheduleTweet(tweet) {
    if(!tweet || !tweet.variations) return;
    console.log('<== Scheduler: tweet ', helper.getTweetString(tweet), '==>');
    for(var i=tweet.variations.length;i-->1;) {
      if (isReadyToSchedule(tweet, i)) {
        scheduleVariation(tweet, i);
      }
    }
  }
  
  function scheduleVariation(tweet, index) {
    if (!tweet || !tweet.variations || !tweet.variations[index]) return;
    var timeout = tweet.variations[index].time - new Date().getTime();
    if (timeout < 0) timeout = 0;
    console.log('<== Scheduler: scheduling ', helper.getTweetString(tweet), tweet.variations[index], timeout, '==>');
    Meteor.setTimeout(function () {
      self.task(tweet, index);
    }, timeout);
  }
  
  function isReadyToSchedule (tweet, index) {
    return tweet.variations[index].sent === false
    && tweet.variations[index].error === null
    && tweet.variations[index].time < self.timer.timeLimit();
  }
  
  return this;
}
