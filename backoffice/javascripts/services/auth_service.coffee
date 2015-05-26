'use strict'

app = angular.module 'dashboard'

app.factory 'AuthService', ($q, $sessionStorage, Restangular, API) ->

  login: (email, password) ->
    API.auth.login(email, password)
    .then Restangular.stripRestangular
    .then (res) ->
      $sessionStorage.token = res.token

  logout: ->
    API.auth.logout()
    .then =>
      this.deleteUserData()

  deleteUserData: ->
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
    if !$sessionStorage.token
      return $q.when(false)

    this.ensureUserData()
    .then -> true

