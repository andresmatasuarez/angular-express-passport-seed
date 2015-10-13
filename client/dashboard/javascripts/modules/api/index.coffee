'use strict'

require 'restangular'

angular = require 'angular'
API     = require './api'

angular
.module 'api', [ 'restangular' ]
.factory 'API', API

module.exports = 'api'
