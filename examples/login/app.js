var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , DailyCredStrategy = require("../../../passport-dailycred/lib/passport-dailycred/index.js").Strategy; //use local repo
  // , DailyCredStrategy = require('passport-dailycred').Strategy;

var DAILYCRED_CLIENT_ID = "78b6deb7-c252-4739-9988-23c91da7acf5"
var DAILYCRED_SECRET = "33e355d1-9e39-465e-b8d6-fcc734ce6e37-ee05ae3d-9bbe-4996-b6fd-04fa0341fc7f";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Dailycred profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the DailycredStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Dailycred
//   profile), and invoke a callback with a user object.
passport.use(new DailyCredStrategy({
    clientID: DAILYCRED_CLIENT_ID,
    clientSecret: DAILYCRED_SECRET,
    callbackURL: "http://localhost:3000/auth/dc/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's Dailycred profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Dailycred account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/dc
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Dailycred authentication will involve
//   redirecting the user to Dailycred.com.  After authorization, Dailycred will
//   redirect the user back to this application at /auth/Dailycred/callback
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

// GET /auth/Dailycred/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/dc/callback',
  passport.authenticate('dailycred', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });



app.get('/logout', function(req, res){
  req.logout();
  req.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
