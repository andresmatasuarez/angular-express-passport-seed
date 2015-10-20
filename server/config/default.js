'use strict';

var url          = require('url');
var path         = require('path');
var Environments = require('./environments');

var aYear = 31556952000;
var projectRoot = path.normalize(path.join(__dirname, '../../'));

module.exports = {
  environments: Environments,
  root: projectRoot,
  app: {
    assets: {
      path     : path.join(projectRoot, './bundle'),
      mappings : path.join(projectRoot, './bundle/webpack-assets.json'),
      max_age  : aYear
    },
    views: {
      path: path.join(projectRoot, './server/views')
    },
    dashboard: {
      title  : 'Dashboard',
      root   : '../../assets', // TODO review when reviewing HTML5 support
      index  : 'dashboard.html',
      base   : '/dashboard/'
    },
    web: {
      title  : 'Web',
      root   : '../../assets', // TODO review when reviewing HTML5 support
      index  : 'web.html',
      base   : '/web/'
    },
    api: {
      base: '/api'
    }
  },
  server: {
    port: process.env.PORT || 3000,
    logs: false,
    ssl: {
      enable      : true,
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
