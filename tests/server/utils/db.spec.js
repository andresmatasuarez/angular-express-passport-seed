'use strict';

var url      = require('url');
var config   = require('config');
var expect   = require('chai').expect;
var mongoose = require('mongoose');
var db       = require('../../../server/utils/db');

var DEFAULT_PORT = 27017;

var clearConnection = function(done){
  if (mongoose.connection.readyState === mongoose.Connection.STATES.disconnected ||
      mongoose.connection.readyState === mongoose.Connection.STATES.uninitialized){
    return done();
  }
  mongoose.connection.once('disconnected', function(){
    done();
  });
  mongoose.disconnect();
};

describe('/utils/db', function(){

  var uri = {
    host: url.parse(config.mongo.uri).hostname,
    port: url.parse(config.mongo.uri).port || DEFAULT_PORT,
    name: url.parse(config.mongo.uri).pathname.replace('/', '')
  };

  before(clearConnection);

  afterEach(clearConnection);

  it('should connect to config.mongo.uri', function(done){
    db.connect()
    .then(function(connectedTo){

      expect(connectedTo).to.eql(config.mongo.uri);
      expect(mongoose.connection.readyState).to.eql(mongoose.Connection.STATES.connected);
      expect(mongoose.connection.db.serverConfig.host).to.eql(uri.host);
      expect(mongoose.connection.db.serverConfig.port).to.eql(uri.port);
      expect(mongoose.connection.db.databaseName).to.eql(uri.name);

      done();
    })
    .catch(done);
  });

  it('should disconnect from database', function(done){
    mongoose.connect(config.mongo.uri, config.mongo.options);
    mongoose.connection.once('open', function(){
      db.disconnect()
      .then(function(disconnectedFrom){
        expect(disconnectedFrom).to.eql(config.mongo.uri);
        expect(mongoose.connection.readyState).to.eql(mongoose.Connection.STATES.disconnected);
        done();
      })
      .catch(done);
    });
  });

  it('should detect a previous opened connection and not try to open a new one', function(done){
    mongoose.connect(config.mongo.uri, config.mongo.options);
    mongoose.connection.once('open', function(){
      db.connect()
      .then(function(alreadyConnectedTo){
        expect(alreadyConnectedTo).to.eql(config.mongo.uri);
        expect(mongoose.connection.readyState).to.eql(mongoose.Connection.STATES.connected);
        done();
      })
      .catch(done);
    });
  });

});
