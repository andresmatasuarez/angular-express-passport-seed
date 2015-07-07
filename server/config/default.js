'use strict';

var url          = require('url');
var Environments = require('./environments');

module.exports = {
  environments: Environments,
  app: {
    client: {
      root   : '../../client',
      tmp    : '../../.tmp/client',
      module : 'web',
      base   : '/web/'
    },
    backoffice: {
      root   : '../../backoffice',
      tmp    : '../../.tmp/backoffice',
      module : 'dashboard',
      base   : '/dashboard/'
    },
    api: {
      base: '/api'
    },
    dependencies: {
      frontend: '../../bower_components'
    }
  },
  server: {
    port: process.env.PORT || 3000,
    logs: false,
    ssl: {
      port        : process.env.SSL_PORT || 443,
      key         : 'server/config/ssl/key.pem',
      certificate : 'server/config/ssl/certificate.crt',
      passphrase  : process.env.SSL_PASSPHRASE
    },
    auth: {
      issuer       : 'ExpressJS/AngularJS seed',
      token_secret : process.env.TOKEN_SECRET,
      expiration   : 30 * 60 * 1000
    }
  },
  mongo: {
    uri: process.env.MONGO_URL
  },
  redis: {
    keyspace : 'session:',
    host     : process.env.REDIS_URL ? url.parse(process.env.REDIS_URL).hostname           : undefined,
    port     : process.env.REDIS_URL ? url.parse(process.env.REDIS_URL).port               : undefined,
    pass     : process.env.REDIS_URL ? url.parse(process.env.REDIS_URL).auth.split(':')[1] : undefined
  }
};
