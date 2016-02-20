'use strict'

module.exports = ($q, $sessionStorage, API) ->

  login: (email, password) ->
    API.auth.login email, password
    .then =>
      this.ensureAdminData()

  logout: ->
    this.deleteAdminData()
    API.auth.logout()

  deleteAdminData: ->
    delete $sessionStorage.admin

  fetchAdminData: ->
    API.auth.me().then (admin) -> $sessionStorage.admin = admin

  ensureAdminData: ->
    if $sessionStorage.admin
      $q.when()
    else
      this.fetchAdminData()
