'use strict'

app = angular.module 'dashboard'

app.factory 'AuthService', ($q, $sessionStorage, Restangular, API) ->
  login: (email, password) ->
    API.auth.login(email, password)
    .then Restangular.stripRestangular
    .then (userInfo) ->
      $sessionStorage.user = userInfo

  logout: ->
    API.auth.logout()
    .then ->
      delete $sessionStorage.user

  isAuthenticated: ->
    API.auth.me()
    .then (user) ->
      $sessionStorage.$default
        user: user
    .catch (err) ->
      $sessionStorage.$default
        user: {}

  isAuthorized: ->
    this.isAuthenticated()
    .finally ->
      if _.isEmpty $sessionStorage.user
        $q.reject
          authenticated: false
      else
        $q.when()
