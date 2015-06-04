'use strict';

var redis = require('redis');

var DEFAULT_REDIS_PORT = 6379;
var DEFAULT_REDIS_HOST = 'localhost';

module.exports = {

  createClient: function(config){
    var port = config.port || DEFAULT_REDIS_PORT;
    var host = config.host || DEFAULT_REDIS_HOST;

    var client = redis.createClient(port, host, {
      // Added for deployment on Heroku
      no_ready_check: true
    });

    if (config.pass){
      client.auth(config.pass);
    }

    return client;
  }

};
