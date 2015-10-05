'use strict'

angular         = require 'angular'
ngStorage       = require 'ngstorage'
AuthInterceptor = require './auth_interceptor'

angular
.module 'auth-interceptor', [ 'ngStorage' ]
.factory 'AuthInterceptor', AuthInterceptor
.config ($httpProvider) ->
  $httpProvider.interceptors.push 'AuthInterceptor'

module.exports = 'auth-interceptor'
