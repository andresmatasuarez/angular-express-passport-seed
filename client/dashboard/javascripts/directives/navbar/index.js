import _        from 'lodash';
import template from './navbar.jade';

export default function navbar($state, $sessionStorage, AuthService) {
  return {
    restrict : 'E',
    replace  : true,
    scope    : {},
    template,
    link($scope) {
      $scope._        = _;
      $scope.$storage = $sessionStorage;
      $scope.inspect  = () => $state.go('admins.edit', { id: $sessionStorage.admin._id });
      $scope.logout   = () => AuthService.logout().then(() => $state.go('login'));
    }
  };
}
