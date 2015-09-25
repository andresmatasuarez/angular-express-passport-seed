'use strict'

module.exports = (Restangular) ->
  api  = Restangular.all 'api'

  auth:
    me: ->
      api.one('auth', 'me').get()
      .then Restangular.stripRestangular

    login: (email, password) ->
      body = $.param
        email    : email,
        password : password

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('auth', 'login').customPOST body, undefined, undefined, headers
      .then Restangular.stripRestangular

    logout: ->
      api.one('auth', 'logout').post()

  users:
    total: ->
      api.one('users', 'total').get()
      .then _.property('total')

    list: (skip, limit) ->
      api.customGETLIST 'users',
        skip  : skip
        limit : limit

    get: (id) ->
      api.one('users', id).get()

    create: (user) ->
      body = $.param
        email           : user.email
        password        : user.password
        confirmPassword : user.confirmPassword

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('users').customPOST body, undefined, undefined, headers

    edit: (id, user) ->
      body = $.param
        email           : user.email
        password        : user.password
        newPassword     : user.newPassword
        confirmPassword : user.confirmPassword

      headers =
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

      api.one('users', id).customPUT body, undefined, undefined, headers

    delete: (id) ->
      api.one('users', id).remove()
