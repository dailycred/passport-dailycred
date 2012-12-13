# Passport-Dailycred

[![Build Status](https://secure.travis-ci.org/dailycred/passport-dailycred.png?branch=master)](https://travis-ci.org/dailycred/passport-dailycred)

[Passport](http://passportjs.org/) strategy for authenticating with [Dailycred](https://www.dailycred.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Dailycred authentication in your Node.js applications.
By plugging into Passport, Dailycred authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-dailycred

## Usage

#### Configure Strategy

The Dailycred authentication strategy authenticates users using a Dailycred
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a app ID, app secret, and callback URL.

    passport.use(new DailycredStrategy({
        clientID: DAILYCRED_APP_ID,
        clientSecret: DAILYCRED_SECRET,
        callbackURL: "http://localhost:3000/auth/dailycred/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ dailycredId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'dailycred'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/signup',
      passport.authenticate('dailycred'));

    app.get('/auth/signin',
      passport.authenticate('dailycred', {action:'signin'})); //uses param ?action=signin

    //setup a route for each provider, so you can use /auth/facebook, etc
    var providers = ["facebook","google","twitter"];
    var provider;
    for (i in providers){
      provider = providers[i];
      app.get("/auth/"+provider,
        passport.authenticate('dailycred', {identity_provider: provider}))
    }

    app.get('/auth/dailycred/callback',
      passport.authenticate('dailycred', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });



## Examples

For a complete, working example, refer to the [login example](https://github.com/hstove/passport-dailycred/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test


## Credits

  - [Hank Stoever](http://github.com/hstove)
  - [Jared Hanson](http://github.com/jaredhanson) - this repo was built off of a fork of Jared's [Passport-facebook](https://github.com/jaredhanson/passport-facebook) module.

## License

(The MIT License)

Copyright (c) 2011 Hank Stoever

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

![](https://www.dailycred.com/dc.gif?client_id=dailycred&title=passport_repo "dailycred")
