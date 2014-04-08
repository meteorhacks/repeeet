Meteor.publish('tweets', function() {
  if (this.userId) {
    var selector = {userId: this.userId};
    return Tweets.find(selector);
  } else {
    this.ready();
  }
});

Meteor.publish('settings', function() {
  if (this.userId) {
    var selector = {_id: this.userId};
    var cursor = Settings.find(selector);
    if(cursor.count() == 0) {
      var newSettings = Defaults.Settings();
      newSettings._id = this.userId;
      Settings.insert(newSettings);
    }
    return cursor;
  } else {
    this.ready();
  }
});
