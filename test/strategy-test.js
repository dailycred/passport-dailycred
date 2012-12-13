var vows = require('vows');
var assert = require('assert');
var util = require('util');
var DailycredStrategy = require('passport-dailycred/strategy');


vows.describe('DailycredStrategy').addBatch({

  'strategy': {
    topic: function() {
      var strategy = new DailycredStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
      assert.equal(strategy.name, 'Dailycred');
    },
  },

  'strategy when loading user profile': {
    topic: function() {
      var strategy = new DailycredStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});

      // utils.puts(util.inspect(strategy));

      return strategy;
    },

    'when told to load user profile': {
      topic: function(strategy) {
        var strategy = new DailycredStrategy({
          clientID: 'ABC123',
          clientSecret: 'secret'
        }, function(){});
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        // mock
        strategy._oauth2.get = function(url, accessToken, callback) {
          var body = '{"provider":"dailycred","id":"500308595","email":"hank@hank.com","created":100,"username":"hank","admin": true,"tags":["awesome"],"subscribed":true, "referred_by":"1100", "referred":["1100"], "facebook":{"id":"500308595","displayname":"Jared Hanson","first_name":"Jared","last_name":"Hanson","link":"http:\\/\\/www.facebook.com\\/jaredhanson","username":"jaredhanson","gender":"male","email":"jaredhanson\\u0040example.com"}}';
          callback(null, body, undefined);
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },

      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        facebook = profile.facebook;
        assert.equal(profile.provider, 'dailycred');
        assert.equal(profile.id, '500308595');
        assert.equal(profile.username, 'hank');
        assert.equal(profile.email, 'hank@hank.com');
        assert.equal(profile.created, 100);
        assert.equal(profile.username, "hank");
        assert.equal(profile.admin, true);
        assert.equal(profile.tags[0], "awesome");
        assert.equal(profile.subscribed, true);
        assert.equal(profile.referredBy, "1100");
        assert.equal(profile.referred[0], "1100");
        // assert.equal(facebook.username, "jaredhanson");
        // assert.equal(facebook.displayname, 'Jared Hanson');
        // assert.equal(facebook.first_name, 'Jared');
        // assert.equal(facebook.last_name, 'Hanson');
        // assert.equal(facebook.gender, 'male');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },

  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new DailycredStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});

      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }

      return strategy;
    },

    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },

      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);
