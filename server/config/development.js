'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.development,
  server: {
    logs: true,
    ssl: {
      port           : 3001,
      key            : 'server/config/ssl/key.pem',
      certificate    : 'server/config/ssl/certificate.crt',
      passphrase     : 'server/config/ssl/passphrase'
    }
  },
  mongo: {
    uri: 'mongodb://localhost/seed_dev'
  },
  redis: {
    host : 'localhost',
    port : 6379
  }
};
