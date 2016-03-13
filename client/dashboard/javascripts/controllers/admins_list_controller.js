export default class AdminsListController {

  /* ngInject */
  constructor($scope, $q, $state, API, confirmationModalService) {
    $scope.addAdmin = () => {
      $state.go('admins.add');
    };

    $scope.getAdminPage = (skip, limit) => $q.all([
      API.admins.total(),
      API.admins.list(skip, limit)
    ]);

    $scope.tableOptions = {
      getPage: $scope.getAdminPage,
      actions: {
        inspect: {
          method(admin) {
            $state.go('admins.edit', { id: admin._id });
          },
          reload: false
        },
        remove: {
          method(admin) {
            return confirmationModalService.open({
              title       : 'Delete admin',
              message     : `Do you wish to delete admin ${admin.email}?`,
              closeLabel  : 'Cancel',
              acceptLabel : 'Delete'
            })
            .result
            .then(() => API.admins.delete(admin._id));
          }
        }
      }
    };
  }

}
