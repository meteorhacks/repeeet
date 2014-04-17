var assert = require('assert');

suite('Tweeter', function () {
  test('Post tweet', postNewTweet);
  test('User error (403) when posting tweet', userError);
  test('Twitter error. Retry at once', firstRetry);
  test('Twitter error. Retry until timeout', retryTimeout);

  function postNewTweet (done, server, client) {
    var result = server.evalSync(function () {
      var success = false;
      var error = null;
      var status = null;
      var tweeter = new Tweeter({Twit: function (params) {
        this.post = function (cmd, params, callback) {
          status = params.status;
          callback();
        }
      }});
      Meteor.setTimeout(returnResults, 500);
      tweeter.tweet('user_id_001', 'tweet_text', setSuccess);
      function returnResults () {emit('return', {error: error, success: success, status: status})}
      function setSuccess (err) {if (err) error = err; else success = true;}
    });
    assert.equal(null, result.error);
    assert.equal(true, result.success);
    assert.equal('tweet_text', result.status);
    done();
  }

  function userError (done, server, client) {
    var result = server.evalSync(function () {
      var success = false;
      var error = null;
      var tweeter = new Tweeter({Twit: function (params) {
        this.post = function (cmd, params, callback) {
          callback({statusCode: 403});
        }
      }});
      Meteor.setTimeout(returnResults, 500);
      tweeter.tweet('user_id_001', 'tweet_text', setSuccess);
      function returnResults () {emit('return', {error: error, success: success})}
      function setSuccess (err) {if (err) error = err; else success = true;}
    });
    assert.equal('user error', result.error);
    assert.equal(false, result.success);
    done();
  }

  function firstRetry (done, server, client) {
    var result = server.evalSync(function () {
      var success = false;
      var error = null;
      var retries = 0;
      var status = [];
      var tweeter = new Tweeter({baseTimeout: 100, maxTimeout: 200, Twit: function (params) {
        this.post = function (cmd, params, callback) {
          if (retries < 2) {
            retries++;
            callback('SUCH ERROR! SO FAKE');
          } else {
            callback();
          }
        }
      }});
      Meteor.setTimeout(checkStatus, 0);
      Meteor.setTimeout(checkStatus, 50);
      Meteor.setTimeout(checkStatus, 300);
      Meteor.setTimeout(returnResults, 500);
      tweeter.tweet('user_id_001', 'tweet_text', setSuccess);
      function checkStatus () {status.push({success: success, retries: retries});}
      function returnResults () {emit('return', {error: error, status: status})}
      function setSuccess (err) {if (err) error = err; else success = true;}
    });
    assert.equal(null, result.error);
    assert.equal(false, result.status[0].success);
    assert.equal(false, result.status[1].success);
    assert.equal(true, result.status[2].success);
    assert.equal(0, result.status[0].retries);
    assert.equal(1+1, result.status[1].retries);
    assert.equal(1+1, result.status[2].retries);
    done();
  }

  function retryTimeout (done, server, client) {
    var result = server.evalSync(function () {
      var success = false;
      var error = null;
      var retries = 0;
      var status = [];
      var tweeter = new Tweeter({baseTimeout: 100, maxTimeout: 200, Twit: function (params) {
        this.post = function (cmd, params, callback) {
          retries++;
          callback('SUCH ERROR! SO FAKE');
        }
      }});
      Meteor.setTimeout(checkStatus, 0);
      Meteor.setTimeout(checkStatus, 50);
      Meteor.setTimeout(checkStatus, 200);
      Meteor.setTimeout(checkStatus, 1300);
      Meteor.setTimeout(returnResults, 1500);
      tweeter.tweet('user_id_001', 'tweet_text', setSuccess);
      function checkStatus () {status.push({success: success, retries: retries});}
      function returnResults () {emit('return', {error: error, status: status})}
      function setSuccess (err) {if (err) error = err; else success = true;}
    });
    assert.equal('timeout', result.error);
    assert.equal(false, result.status[0].success);
    assert.equal(false, result.status[1].success);
    assert.equal(false, result.status[2].success);
    assert.equal(false, result.status[3].success);
    assert.equal(0, result.status[0].retries);
    assert.equal(1+1, result.status[1].retries);
    assert.equal(1+1, result.status[2].retries);
    assert.equal(5+1, result.status[3].retries);
    done();
  }
});
