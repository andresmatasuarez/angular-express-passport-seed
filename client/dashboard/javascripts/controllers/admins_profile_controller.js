import _ from 'lodash';

export default class AdminsProfileController {

  /* ngInject */
  constructor($scope, $state, API, admin) {
    const editing = !_.isEmpty(admin);

    const action = editing ? _.partial(API.admins.edit, admin._id) : API.admins.create;

    $scope.editing = editing;

    // Initialize form model (to avoid ngIf child scopes creating
    // their own 'model' property and thus, causing annoying bugs)
    $scope.model = {};

    if (editing) {
      $scope.model.email = admin.email;
    }

    $scope.save = () => {
      $scope.submitting = true;
      action($scope.model)
      .then(() => $state.go('admins.list'))
      .catch((err) => { $scope.responseErrors = $scope.cleanResponseErrors(err); })
      .finally(() => delete $scope.submitting);
    };

    $scope.cancel = () => $scope.goBack();

    $scope.submittable = () => !$scope.submitting && $scope.form.$dirty && !$scope.form.$invalid;
  }

}
