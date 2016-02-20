'use strict';

const Environments = require('./environments');

module.exports = {
  env: Environments.production,
  server: {
    ssl: {
      enable: false
    }
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};
