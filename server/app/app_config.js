'use strict';

var path        = require('path');
var config      = require('config');
var passport    = require('passport');
var morgan      = require('morgan');
var compression = require('compression');
var bodyparser  = require('body-parser');
var favicon     = require('serve-favicon');
var Middlewares = require('../middlewares');
var User        = require('../model/user');

exports.applyTo = function(app){

  passport.use(User.createStrategy());

  app.enable('trust proxy');

  app.set('view engine', 'jade');
  app.set("views", config.app.views.path);

  if(config.env !== config.environments.test){
    app.use(morgan('dev'));
  }

  if (config.app.favicon){
    app.use(favicon(path.join(__dirname, config.app.favicon)));
  } else {
    app.use('favicon.ico', function(req, res){
      res.status(200);
      res.type('image/x-icon');
    });
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());

  app.use(passport.initialize());

  app.use(Middlewares.TokenExtractor);

};
