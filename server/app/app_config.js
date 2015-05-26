'use strict';

var config      = require('config');
var morgan      = require('morgan');
var compression = require('compression');
var bodyparser  = require('body-parser');
var mongoose    = require('mongoose');
var Middlewares = require('../middlewares');
var User        = require('../model/user');

exports.applyTo = function(app){

  app.enable('trust proxy');

  if(config.env !== config.environments.test){
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());

  app.use(Middlewares.TokenExtractor);

};
