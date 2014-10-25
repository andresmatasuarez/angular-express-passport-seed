'use strict';

var Environments = require('./config/environments');

process.env.NODE_ENV        = process.env.NODE_ENV || Environments.development;
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || './server/config';

if (process.env.NODE_ENV === Environments.test){
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
