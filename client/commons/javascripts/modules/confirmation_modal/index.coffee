'use strict'

angular           = require 'angular'
uibs              = require 'angular-ui-bootstrap'
confirmationModal = require './confirmation_modal'

angular
.module 'confirmation-modal', [ uibs ]
.factory 'confirmationModal', confirmationModal

module.exports = 'confirmation-modal'
