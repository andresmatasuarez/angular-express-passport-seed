'use strict'

_ = require 'lodash'

module.exports = ($rootScope, $state, AuthService, $templateCache) ->

  # Initial check of authentication
  AuthService.ensureUserData().catch ->
    AuthService.deleteUserData()
    $state.go 'login'

  # State utils
  $rootScope.goBack = ->
    prev = $rootScope.previousState

    if prev
      $state.go prev.name, prev.params
    else
      $state.go 'home'

  $rootScope.goToNextState = ->
    next = $rootScope.nextState

    if next
      $state.go next.name, next.params
    else
      $state.go 'home'

  # Form utils
  $rootScope.extendForm = (form) ->
    form.hasError = (fieldName) ->
      form[fieldName].$dirty && form[fieldName].$invalid

  # Error utils
  $rootScope.cleanResponseErrors = (err) ->
    if _.isString err
      [ err ]
    else if _.isUndefined(err.data) || _.isUndefined(err.data.message)
      if _.isArray err.data then err.data else [ err.data ]
    else
      [ err.data.message ]

  $rootScope.$on 'auth:unauthorized', (msg, data) ->
    AuthService.deleteUserData()
    $state.go 'login'

  $rootScope.$on 'auth:already_logged', (msg, data) ->
    prev = $rootScope.previousState
    $state.go 'home'

  $rootScope.$on 'connection_refused', (msg, data) ->
    console.log 'connection refused'

  # Keep track of previous and current states.
  $rootScope.$on '$stateChangeSuccess', (ev, to, toParams, from, fromParams) ->
    $rootScope.previousState =
      name   : from.name
      params : fromParams

    $rootScope.currentState =
      name   : to.name
      params : toParams

    $rootScope.nextState = undefined

  # Keep track of every state change
  $rootScope.$on '$stateChangeStart', (ev, to, toParams, from, fromParams) ->
    if to.name != 'login'
      $rootScope.nextState =
        name   : to.name
        params : toParams

  # TODO improve client-side error handling
  $rootScope.$on '$stateChangeError', (ev, to, toParams, from, fromParams, error) ->
    console.log('changeError', error, to, from);
