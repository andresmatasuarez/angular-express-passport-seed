'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.test,
  server: {
    auth: {
      token_secret: 'mercyfulfate'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/seed_test'
  }
};
