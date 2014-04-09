Template.tweetItem.helpers({
  toDay: getDay
});

Template.tweetItem.events({
  'click .tweet-delete': deleteTweet
});

function getDay (ts) {
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var date = new Date(ts);
  var day = date.getDay();
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return days[day] + ' ' + time;
}

function deleteTweet (e) {
  Tweets.remove({_id: this._id});
}
