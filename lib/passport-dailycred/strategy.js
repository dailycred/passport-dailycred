//Module dependencies.
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


//
// `Strategy` constructor.
//
// The dailycred authentication strategy authenticates requests by delegating to
// dailycred using the OAuth 2.0 protocol.
//
// Applications must supply a `verify` callback which accepts an `accessToken`,
// `refreshToken` and service-specific `profile`, and then calls the `done`
// callback supplying a `user`, which should be set to `false` if the
// credentials are not valid.  If an exception occured, `err` should be set.
//
// Options:
//   - `clientID`      your dailycred application's App ID
//   - `clientSecret`  your dailycred application's App Secret
//   - `callbackURL`   URL to which dailycred will redirect the user after granting authorization
//
// Examples:
//
//     passport.use(new dailycredStrategy({
//         clientID: '123-456-789',
//         clientSecret: 'shhh-its-a-secret'
//         callbackURL: 'https://www.example.net/auth/dailycred/callback'
//       },
//       function(accessToken, refreshToken, profile, done) {
//         User.findOrCreate(..., function (err, user) {
//           done(err, user);
//         });
//       }
//     ));
//
function Strategy(options, verify) {
  options = options || {};
  options.baseSite = "https://www.dailycred.com";
  options.authorizationURL = options.authorizationURL || 'https://www.dailycred.com/connect';
  options.tokenURL = options.tokenURL || 'https://www.dailycred.com/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'dailycred';
}


// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Return extra Dailycred-specific parameters to be included in the authorization
 * request.
 *
 * Options:
 *  - `action`  Display mode to render dialog, { `signin`, `signup` }.
 *  - `identity_provider` the specific provider you wish to signin with { `facebok`, `google`, `twitter`, `email` and more } see https://www.dailycred.com/docs/serverside
 *  - `access_token` attach an existing user's access token to connect them with a new identity provider
 *
 * @param {Object} options
 * @return {Object}
 */
Strategy.prototype.authorizationParams = function (options) {
  var params = {};
  safeAdd(params, options, "access_token");
  safeAdd(params, options, "action");
  safeAdd(params, options, "identity_provider");

  return params;
};

//util for adding to an object only if not null in the options object
function safeAdd(object, options, key) {
  if (options[key]){
    object[key] = options[key].toLowerCase();
  }
}


//
//Retrieve user profile from dailycred.
//
//This function constructs a normalized profile, with the following properties:
//
//  - `provider`         always set to `dailycred`
//  - 'id'               user's dailycred id
//  - 'email'            user's email
//  - 'created'          the date they were created
//  - 'username'
//  - 'admin'            a boolean, whether they have been marked as an admin on dailycred
//  - 'tags'             an array of tags for this user
//  - 'subscribed'       a boolean, whether they have explicitely unsubscibed or not through dailycred
//  - 'referred\_by'      a user\_id, if this user was referred by someone
//  - 'referred'         an array of user\_id's, which this user has referred
//  - 'facebook'         an object, which directly mimicks the response from facebook's me.json
//
//
// All values could be undefined in any response, except for 'id', 'provider', and 'created'
//
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://www.dailycred.com/graph/me.json', accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }
    try {
      var json = JSON.parse(body);

      var profile = { provider: 'dailycred' };
      profile.id = json.id || json.user_id;
      profile.email = json.email;
      profile.created = json.created;
      profile.username = json.username;
      profile.admin = json.admin;
      profile.tags = json.tags;
      profile.subscribed = json.subscribed;
      profile.referredBy = json.referred_by;
      profile.referred = json.referred;
      profile.identities = json.identities;
      profile.accessTokens = json.access_tokens;
      profile.emails = json.emails;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


// Expose 'strategy'
module.exports = Strategy;
