'use strict';

const redis = require('redis');

const DEFAULT_REDIS_PORT = 6379;
const DEFAULT_REDIS_HOST = 'localhost';

module.exports = {

  createClient(config) {
    const port = config.port || DEFAULT_REDIS_PORT;
    const host = config.host || DEFAULT_REDIS_HOST;

    const client = redis.createClient(port, host, {
      no_ready_check: true // Added for deployment on Heroku
    });

    if (config.pass) {
      client.auth(config.pass);
    }

    return client;
  }

};
