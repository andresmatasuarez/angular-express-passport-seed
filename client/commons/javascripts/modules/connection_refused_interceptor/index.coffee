'use strict'

angular                      = require 'angular'
ConnectionRefusedInterceptor = require './connection_refused_interceptor'

angular
.module 'connection-refused-interceptor', []
.factory 'ConnectionRefusedInterceptor', ConnectionRefusedInterceptor
.config ($httpProvider) ->
  $httpProvider.interceptors.push 'ConnectionRefusedInterceptor'

module.exports = 'connection-refused-interceptor'
