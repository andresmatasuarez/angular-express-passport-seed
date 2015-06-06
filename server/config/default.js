'use strict';

module.exports = {
  environments: require('./environments'),
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
      port: process.env.SSL_PORT || 443
    },
    auth: {
      issuer           : 'ExpressJS/AngularJS seed',
      token_secret     : 'mercyfulfate',
      expiration       : 30 * 60 * 1000,
      salt_work_factor : 10
    }
  },
  redis: {
    keyspace : 'session:',
    host     : 'localhost',
    port     : 6379
  }
};
