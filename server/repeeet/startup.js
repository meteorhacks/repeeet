repeeeter = new Repeeeter();
scheduler = new RepeeetScheduler({interval: 1000*60*60, task: repeeeter.tweet});

Meteor.startup(function () {
  console.log('<== startup ', new Date().toLocaleString(), '==>');
  var twitterConfig = Accounts.loginServiceConfiguration.findOne({service: 'twitter'});
  if(!twitterConfig) {
    console.log('<== Config: twitter config not configured, checking environment variables ==>');
    var config = {
      service: 'twitter',
      consumerKey: process.env.TWITTER_API_KEY,
      secret: process.env.TWITTER_API_SECRET
    };
    if(config.consumerKey && config.secret) {
      console.log('<== Config: found twitter config environment variables ==>');
      Accounts.loginServiceConfiguration.insert(config);
      scheduler.start();
    } else {
      console.log('<== Config: cannot find twitter config environment variables ==>');
      throw new Error('Please create twitter api key and secret environment variables or manually add them to the database.');
    }
  }
});

//APM Config

if(Meteor.settings && Meteor.settings.apm) {
  var apmInfo = Meteor.settings.apm;
  Apm.connect(apmInfo.appId, apmInfo.appSecret);
}