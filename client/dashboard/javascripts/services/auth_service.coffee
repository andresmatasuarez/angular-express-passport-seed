'use strict'

module.exports = ($q, $sessionStorage, API) ->

  login: (email, password) ->
    API.auth.login email, password
    .then =>
      this.ensureUserData()

  logout: ->
    this.deleteUserData()
    API.auth.logout()

  deleteUserData: ->
    delete $sessionStorage.user

  fetchUserData: ->
    API.auth.me().then (user) -> $sessionStorage.user = user

  ensureUserData: ->
    if $sessionStorage.user
      $q.when()
    else
      this.fetchUserData()
