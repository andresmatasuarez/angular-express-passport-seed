'use strict'

app = angular.module 'dashboard'

app.factory 'AuthService', ($q, $sessionStorage, Restangular, API) ->

  login: (email, password) ->
    API.auth.login(email, password)
    .then Restangular.stripRestangular
    .then (res) ->
      $sessionStorage.token = res.token

  logout: ->
    # API.auth.logout()
    $q.when()
    .then ->
      delete $sessionStorage.token
      delete $sessionStorage.user

  fetchUserData: ->
    API.auth.me()
    .then (user) -> $sessionStorage.user = user

  ensureUserData: ->
    if $sessionStorage.user then $q.when() else this.fetchUserData()

  isAuthenticated: ->
    if !$sessionStorage.token
      $q.reject
        status: 401

    this.ensureUserData()

  alreadyLogged: ->
    $q.when()
    .then =>
      if !$sessionStorage.token
        return false

      this.ensureUserData()
      .then -> true

