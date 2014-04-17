var assert = require('assert');

suite('Scheduler', function () {
  test('New tweet with variations within schedule time', testNewTweetWithVariation);
  test('New tweet without variations within schedule time', testNewTweetWithoutVariation);
  test('New tweet with variations within next iteration', testNewTweetNextIteration);
  test('Database tweet with variations within schedule time', testDatabaseTweetWithVariation);

  function testNewTweetWithVariation (done, server, client) {
    var result = server.evalSync(function () {
      var tweets = [];
      var counts = [];
      var scheduler = new RepeeetScheduler({interval: 1000, task: pushTweet});
      var settings = {repeatCount: 3, intervalValue: 600, intervalUnit: 'Millis', intervalUnitOptions: [{title: 'Millis', millis: 1}]};
      scheduler.start();
      Meteor.setTimeout(pushCount, 200);
      Meteor.setTimeout(pushCount, 800);
      Meteor.setTimeout(returnResults, 1000);
      scheduler.add({variations: helper.getVariations(null, settings)});
      function pushTweet(tweet, index) {tweets.push({tweet: tweet, index: index})}
      function pushCount() {counts.push(tweets.length)}
      function returnResults() {emit('return', {tweets: tweets, counts: counts})}
    });
    assert.equal(result.counts[0], 1);
    assert.equal(result.counts[1], 2);
    done();
  }
  
  function testNewTweetWithoutVariation (done, server, client) {
    var result = server.evalSync(function () {
      var tweets = [];
      var counts = [];
      var scheduler = new RepeeetScheduler({interval: 1000, task: pushTweet});
      var settings = {repeatCount: 3, intervalValue: 2000, intervalUnit: 'Millis', intervalUnitOptions: [{title: 'Millis', millis: 1}]};
      scheduler.start();
      Meteor.setTimeout(pushCount, 200);
      Meteor.setTimeout(pushCount, 900);
      Meteor.setTimeout(returnResults, 1200);
      scheduler.add({variations: helper.getVariations(null, settings)});
      function pushTweet(tweet, index) {tweets.push({tweet: tweet, index: index})}
      function pushCount() {counts.push(tweets.length)}
      function returnResults() {emit('return', {tweets: tweets, counts: counts})}
    });
    assert.equal(result.counts[0], 1);
    assert.equal(result.counts[1], 1);
    done();
  }
  
  function testNewTweetNextIteration (done, server, client) {
    var result = server.evalSync(function () {
      var tweets = [];
      var counts = [];
      var scheduler = new RepeeetScheduler({interval: 1000, task: pushTweet});
      var settings = {repeatCount: 3, intervalValue: 1200, intervalUnit: 'Millis', intervalUnitOptions: [{title: 'Millis', millis: 1}]};
      scheduler.start();
      Meteor.setTimeout(pushCount, 200);
      Meteor.setTimeout(pushCount, 900);
      Meteor.setTimeout(pushCount, 1600);
      Meteor.setTimeout(returnResults, 1800);
      scheduler.add({variations: helper.getVariations(null, settings)});
      function pushTweet(tweet, index) {tweets.push({tweet: tweet, index: index})}
      function pushCount() {counts.push(tweets.length)}
      function returnResults() {emit('return', {tweets: tweets, counts: counts})}
    });
    assert.equal(result.counts[0], 1);
    assert.equal(result.counts[1], 1);
    assert.equal(result.counts[2], 2);
    done();
  }
  
  function testDatabaseTweetWithVariation (done, server, client) {
    var result = server.evalSync(function () {
      var tweets = [];
      var counts = [];
      var scheduler = new RepeeetScheduler({interval: 1000, task: pushTweet});
      var settings = {repeatCount: 3, intervalValue: 1200, intervalUnit: 'Millis', intervalUnitOptions: [{title: 'Millis', millis: 1}]};
      Tweets.insert({variations: helper.getVariations(null, settings)})
      scheduler.start();
      Meteor.setTimeout(pushCount, 200);
      Meteor.setTimeout(pushCount, 900);
      Meteor.setTimeout(pushCount, 1600);
      Meteor.setTimeout(returnResults, 1800);
      function pushTweet(tweet, index) {tweets.push({tweet: tweet, index: index})}
      function pushCount() {counts.push(tweets.length)}
      function returnResults() {emit('return', {tweets: tweets, counts: counts})}
    });
    assert.equal(result.counts[0], 0);
    assert.equal(result.counts[1], 0);
    assert.equal(result.counts[2], 1);
    done();
  }
});
