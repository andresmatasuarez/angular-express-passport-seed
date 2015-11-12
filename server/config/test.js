'use strict';

const Environments = require('./environments');

module.exports = {
  env: Environments.test,
  server: {
    auth: {
      tokenSecret: 'mercyfulfate'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/seed_test'
  }
};
