import templateErrorModal from './_error_modal.jade';

export default class ErrorModalService {

  constructor($uibModal) {
    this.$uibModal = $uibModal;
  }

  open(message, status, extras) {
    return this.$uibModal.open({
      templateUrl : templateErrorModal,
      size        : 'sm',
      controller  : [
        '$scope', ($scope) => {
          $scope.status  = status;
          $scope.message = message;
          $scope.extras  = extras;
        }
      ]
    });
  }

}
