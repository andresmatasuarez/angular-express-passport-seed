'use strict'

app = angular.module 'dashboard'

app.factory 'AuthInterceptor', ($q, $sessionStorage) ->

  request: (config) ->
    config.headers = config.headers || {}
    config.headers.Authorization = "Bearer #{$sessionStorage.token}" if $sessionStorage.token
    config
