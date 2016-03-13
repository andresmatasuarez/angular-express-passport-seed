import confirmationModalTemplate from './_confirmation_modal.jade';

export default class ConfirmationModalService {

  /* ngInject */
  constructor($uibModal) {
    this.$uibModal = $uibModal;
  }

  open(options) {
    const opts = options || {};
    opts.size = opts.size || 'std';

    return this.$uibModal.open({
      templateUrl : confirmationModalTemplate,
      size        : opts.size,
      controller  : [
        '$scope', ($scope) => {
          $scope.title       = opts.title;
          $scope.message     = opts.message;
          $scope.closeLabel  = opts.closeLabel;
          $scope.acceptLabel = opts.acceptLabel;
        }
      ]
    });
  }

}
