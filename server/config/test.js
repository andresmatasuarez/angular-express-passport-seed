'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.test,
  mongo: {
    uri: 'mongodb://localhost/seed_test'
  }
};
