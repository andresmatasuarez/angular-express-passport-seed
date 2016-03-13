export default function compareToModel() {
  return {
    require: 'ngModel',
    scope: {
      compareToModel: '='
    },
    link($scope, element, attrs, ngModel) {
      ngModel.$validators.compareToModel = (value) => value === $scope.compareToModel;
      $scope.$watch('compareToModel', () => ngModel.$validate());
    }
  };
}
