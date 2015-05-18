'use strict';

var config       = require('config');
var morgan       = require('morgan');
var passport     = require('passport');
var compression  = require('compression');
var session      = require('express-session');
var bodyparser   = require('body-parser');
var cookieparser = require('cookie-parser');
var csurf        = require('csurf');
var MongoStore   = require('connect-mongo')(session);
var mongoose     = require('mongoose');
var User         = require('../model/user');

exports.applyTo = function(app){

  app.enable('trust proxy');

  if(config.env !== config.environments.test){
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(cookieparser());
  app.use(session({
    secret            : config.server.session_secret,
    saveUninitialized : true,
    resave            : true,
    cookie            : { secure: true },
    store             : new MongoStore({ mongoose_connection: mongoose.connections[0] })
  }));

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  /*
   * XSRF protection | Integration with AngularJS
   * From official docs (https://docs.angularjs.org/api/ng/service/$http):
   *   "[...] Angular provides a mechanism to counter XSRF. When performing XHR requests,
   *    the $http service reads a token from a cookie (by default, XSRF-TOKEN) and sets
   *    it as an HTTP header (X-XSRF-TOKEN)."
   *
   * Ideas for integration taken from: http://charandeepmatta.com/2014/06/04/csrfxsrf-protection-express-angular/
   */
  app.use(csurf());
  app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

};
