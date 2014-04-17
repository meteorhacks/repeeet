var assert = require('assert');
//
suite('Repeeter', function () {
  test('Post tweet and update database', postNewTweetAndUpdate);
  test('User error (403) when posting tweet', userErrorAndUpdate);
  test('Twitter error. Retry at once', retryOnceAndUpdate);
  test('Twitter error. Retry until timeout', retryTimeoutAndUpdate);
//
  function postNewTweetAndUpdate (done, server, client) {
    var result = server.evalSync(function () {
      var sentValue = null;
      var errorValue = null;
      Tweets = {
        update: function (selector, params) {
          sentValue = params['$set'].variations[0].sent;
          errorValue = params['$set'].variations[0].error;
        }
      };
      var repeeter = new Repeeeter({Twit: function (params) {
        this.post = function (cmd, params, callback) {
          callback();
        }
      }});
      Meteor.setTimeout(returnResults, 500);
      repeeter.tweet({_id: 'tweet_id_001', variations: [{text: 'Hello', sent: false, error: null}]}, 0);
      function returnResults () {emit('return', {sentValue: sentValue, errorValue: errorValue})}
    });
    assert.equal(true, result.sentValue);
    assert.equal(null, result.errorValue);
    done();
  }
  
  function userErrorAndUpdate (done, server, client) {
    var result = server.evalSync(function () {
      var sentValue = null;
      var errorValue = null;
      Tweets = {
        update: function (selector, params) {
          sentValue = params['$set'].variations[0].sent;
          errorValue = params['$set'].variations[0].error;
        }
      };
      var repeeter = new Repeeeter({Twit: function (params) {
        this.post = function (cmd, params, callback) {
          callback({statusCode: 403});
        }
      }});
      Meteor.setTimeout(returnResults, 500);
      repeeter.tweet({_id: 'tweet_id_001', variations: [{text: 'Hello', sent: false, error: null}]}, 0);
      function returnResults () {emit('return', {sentValue: sentValue, errorValue: errorValue})}
    });
    assert.equal(false, result.sentValue);
    assert.equal('user error', result.errorValue);
    done();
  }
  
  function retryOnceAndUpdate (done, server, client) {
    var result = server.evalSync(function () {
      var sentValue = null;
      var errorValue = null;
      var retries = 0;
      Tweets = {
        update: function (selector, params) {
          sentValue = params['$set'].variations[0].sent;
          errorValue = params['$set'].variations[0].error;
        }
      };
      var repeeter = new Repeeeter({baseTimeout: 100, maxTimeout: 200, Twit: function (params) {
        this.post = function (cmd, params, callback) {
          if (retries < 2) {
            ++retries;
            callback('SUCH ERROR!');
          } else {
            callback();
          }
        }
      }});
      Meteor.setTimeout(returnResults, 500);
      repeeter.tweet({_id: 'tweet_id_001', variations: [{text: 'Hello', sent: false, error: null}]}, 0);
      function returnResults () {emit('return', {sentValue: sentValue, errorValue: errorValue})}
    });
    assert.equal(true, result.sentValue);
    assert.equal(null, result.errorValue);
    done();
  }
  
  function retryTimeoutAndUpdate (done, server, client) {
    var result = server.evalSync(function () {
      var sentValue = null;
      var errorValue = null;
      var retries = 0;
      Tweets = {
        update: function (selector, params) {
          sentValue = params['$set'].variations[0].sent;
          errorValue = params['$set'].variations[0].error;
        }
      };
      var repeeter = new Repeeeter({baseTimeout: 100, maxTimeout: 200, Twit: function (params) {
        this.post = function (cmd, params, callback) {
          ++retries;
          callback('SUCH ERROR!');
        }
      }});
      Meteor.setTimeout(returnResults, 1500);
      repeeter.tweet({_id: 'tweet_id_001', variations: [{text: 'Hello', sent: false, error: null}]}, 0);
      function returnResults () {emit('return', {sentValue: sentValue, errorValue: errorValue})}
    });
    assert.equal(false, result.sentValue);
    assert.equal('timeout', result.errorValue);
    done();
  }
});
