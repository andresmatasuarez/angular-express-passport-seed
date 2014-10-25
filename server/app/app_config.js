'use strict';

var config       = require('config');
var morgan       = require('morgan');
var passport     = require('passport');
var compression  = require('compression');
var session      = require('express-session');
var bodyparser   = require('body-parser');
var cookieparser = require('cookie-parser');
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
    secret: config.server.session_secret,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongoose_connection: mongoose.connections[0]
    })
  }));

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

};
