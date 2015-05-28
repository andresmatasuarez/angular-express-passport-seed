'use strict';

var config      = require('config');
var passport    = require('passport');
var morgan      = require('morgan');
var compression = require('compression');
var bodyparser  = require('body-parser');
var Middlewares = require('../middlewares');
var User        = require('../model/user');

exports.applyTo = function(app){

  passport.use(User.createStrategy());

  app.enable('trust proxy');

  if(config.env !== config.environments.test){
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());

  app.use(passport.initialize());

  app.use(Middlewares.TokenExtractor);

};
