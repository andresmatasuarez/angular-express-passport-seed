'use strict'

angular    = require 'angular'
uibs       = require 'angular-ui-bootstrap'
errorModal = require './error_modal'

angular
.module 'error-modal', [ uibs ]
.factory 'errorModal', errorModal

module.exports = 'error-modal'
