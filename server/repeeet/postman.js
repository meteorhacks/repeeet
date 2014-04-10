Meteor.setInterval(postman, Repeeet.interval);
Meteor.setTimeout(postman, 0);

function postman () {
  var timeLimit = new Date().getTime() + Repeeet.interval;
  var tweets = Tweets.find({"variations": {$elemMatch: {enabled: true, time: {$lt: timeLimit}}}}).fetch();
  console.log('===>>> postman: Found '+tweets.length+' tweets');
  tweets.forEach(function (tweet) {
    Meteor.call('repeeet', tweet);
  });
}
