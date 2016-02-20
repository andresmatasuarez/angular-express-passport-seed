'use strict';

require('angular');
require('angular-mocks');

require('../../client/dashboard/javascripts/app');

const context = require.context('.', true, /.+\.spec\.js?$/);
context.keys().forEach(context);

module.exports = context;
