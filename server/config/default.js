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
    port           : process.env.PORT || 3000,
    logs           : false,
    ssl            : {
      port        : process.env.SSL_PORT || 443,
      key         : 'server/config/ssl/key.pem',
      certificate : 'server/config/ssl/certificate.crt',
      passphrase  : 'server/config/ssl/passphrase'
    }
  }
};
