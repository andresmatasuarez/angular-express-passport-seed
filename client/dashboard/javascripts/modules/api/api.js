import _ from 'lodash';
import $ from 'jquery';

export default function api(Restangular) {
  const apiResource = Restangular.all('api');

  return {

    auth: {
      me() {
        return apiResource.one('auth', 'me').get().then(Restangular.stripRestangular);
      },

      login(email, password) {
        const body = $.param({ email, password });

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };

        return apiResource.one('auth', 'login').customPOST(body, undefined, undefined, headers)
        .then(Restangular.stripRestangular);
      },

      logout() {
        return apiResource.one('auth', 'logout').post();
      }
    },

    admins: {
      total() {
        return apiResource.one('admins', 'total').get().then(_.property('total'));
      },

      list(skip, limit) {
        return apiResource.customGETLIST('admins', { skip, limit });
      },

      get(id) {
        return apiResource.one('admins', id).get();
      },

      create(admin) {
        const body = $.param({
          email           : admin.email,
          password        : admin.password,
          confirmPassword : admin.confirmPassword
        });

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };

        return apiResource.one('admins').customPOST(body, undefined, undefined, headers);
      },

      edit(id, admin) {
        const body = $.param({
          email           : admin.email,
          password        : admin.password,
          newPassword     : admin.newPassword,
          confirmPassword : admin.confirmPassword
        });

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };

        return apiResource.one('admins', id).customPUT(body, undefined, undefined, headers);
      },

      delete(id) {
        return apiResource.one('admins', id).remove();
      }
    }

  };
}
