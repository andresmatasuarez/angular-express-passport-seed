'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.development,
  app: {
    assets: {
      max_age: 0
    },
    web: {
      root: '../../.tmp' // TODO review when reviewing HTML5 support
    },
    dashboard: {
      root: '../../.tmp' // TODO review when reviewing HTML5 support
    }
  },
  server: {
    logs: true,
    ssl: {
      port: 3001
    },
    auth: {
      token_secret: 'mercyfulfate'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/seed_dev'
  }
};
