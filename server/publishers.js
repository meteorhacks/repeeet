Meteor.publish('tweets', function() {
  if (this.userId) {
    return Tweets.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('settings', function() {
  if (this.userId) {
    var cursor = Settings.find({_id: this.userId});
    if(cursor.count() == 0) {
      var newSettings = Defaults.Settings();
      newSettings.buffer.userId =
      Settings.insert(newSettings);
    }
    return cursor;
  } else {
    this.ready();
  }
});
