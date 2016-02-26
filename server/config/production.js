'use strict';

const path         = require('path');
const Environments = require('./environments');

const projectRoot = path.normalize(path.join(__dirname, '../../'));

module.exports = {
  env: Environments.production,
  app: {
    assets: {
      path     : path.join(projectRoot, './assets'),
      mappings : path.join(projectRoot, './assets/webpack-assets.json')
    }
  },
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
