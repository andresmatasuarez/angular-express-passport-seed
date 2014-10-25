'use strict';

app = angular.module 'dashboard'

app.directive 'compareToModel', ->
  require : 'ngModel'
  scope   :
    compareToModel: '='
  link    : ($scope, element, attrs, ngModel) ->
    ngModel.$validators.compareToModel = (value) ->
      value is $scope.compareToModel

    $scope.$watch 'compareToModel', ->
      ngModel.$validate()
