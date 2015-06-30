'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.development,
  server: {
    logs: true
  },
  mongo: {
    uri: 'mongodb://localhost/seed_dev'
  },
  redis: {
    host : 'localhost',
    port : 6379
  }
};
