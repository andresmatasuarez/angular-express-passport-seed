export default class AuthService {

  /* ngInject */
  constructor($q, $sessionStorage, API) {
    this.$q              = $q;
    this.API             = API;
    this.$sessionStorage = $sessionStorage;
  }

  login(email, password) {
    return this.API.auth.login(email, password)
    .then(() => this.ensureAdminData());
  }

  logout() {
    this.deleteAdminData();
    return this.API.auth.logout();
  }

  deleteAdminData() {
    delete this.$sessionStorage.admin;
  }

  fetchAdminData() {
    return this.API.auth.me().then((admin) => { this.$sessionStorage.admin = admin; });
  }

  ensureAdminData() {
    if (this.$sessionStorage.admin) {
      return this.$q.when();
    }
    return this.fetchAdminData();
  }

}
