Template.tweetItem.helpers({
  toDay: getDay
});

Template.tweetItem.events({
  'click .tweet-delete': deleteTweet
});

function getDay (ts) {
  var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var date = new Date(ts);
  var day = date.getDay();
  var time = date.getHours() + ':' + date.getMinutes();
  return days[day] + ' ' + time;
}

function deleteTweet (e) {
  Tweets.remove({_id: this._id});
}
