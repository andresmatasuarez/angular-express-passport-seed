'use strict'

angular         = require 'angular'
AuthInterceptor = require './auth_interceptor'

angular
.module 'auth-interceptor', []
.factory 'AuthInterceptor', AuthInterceptor
.config ($httpProvider) ->
  $httpProvider.interceptors.push 'AuthInterceptor'

module.exports = 'auth-interceptor'
