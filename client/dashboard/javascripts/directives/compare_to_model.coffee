'use strict'

module.exports = ->
  require : 'ngModel'
  scope   :
    compareToModel: '='
  link: ($scope, element, attrs, ngModel) ->
    ngModel.$validators.compareToModel = (value) -> value is $scope.compareToModel
    $scope.$watch 'compareToModel', -> ngModel.$validate()
