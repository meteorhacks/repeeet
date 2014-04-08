Tweets = new Meteor.Collection('tweets');
Tweets.allow({
  insert: function (userId, doc) {
    return userId == doc.userId;
  },
  update: function (userId, doc, fields, modifier) {
    return userId == doc.userId;
  },
  remove: function (userId, doc) {
    return userId == doc.userId;
  }
});

Settings = new Meteor.Collection('settings');
Settings.allow({
  update: function (userId, doc, fields, modifier) {
    return userId == doc._id;
  },
});