'use strict';

var _        = require('lodash');
var bb       = require('bluebird');
var config   = require('config');
var mongoose = require('mongoose');
var Log      = require('./log');

var uri = config.mongo.uri;

module.exports = {
  connect: function(){
    return new bb(function(resolve, reject){

      if (mongoose.connection.readyState === mongoose.Connection.STATES.connected){
        Log.info('Connection to ' + uri + ' already opened.');
        return resolve(uri);
      }

      mongoose.connection.once('error', function(err){
        return reject(err);
      });

      mongoose.connection.once('open', function(){
        Log.info('Successfully connected to: ' + uri);
        return resolve(uri);
      });

      mongoose.connect(uri, config.mongo.options);

    });
  },

  disconnect: function(){
    return new bb(function(resolve, reject){
      mongoose.connection.once('error', function(err){
        return reject(err);
      });

      mongoose.connection.once('disconnected', function(){
        Log.info('Disconnected from ' + uri + '.');
        return resolve(uri);
      });

      mongoose.disconnect();
    });
  }
};
