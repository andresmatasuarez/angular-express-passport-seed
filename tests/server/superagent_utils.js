export default class SuperAgentUtils {
  constructor(agent, options) {
    this.agent   = agent;
    this.jwt     = undefined;
    this.options = options;
  }

  withCookies(req) {
    this.agent.attachCookies(req);
    return req;
  }

  saveCookies(res) {
    this.agent.saveCookies(res);
    return res;
  }

  performLogin(username, password) {
    const body = {};

    // Build request body
    body[this.options.login.usernameField || 'username'] = username;
    body[this.options.login.passwordField || 'password'] = password;

    const requestUrl = this.agent[this.options.login.method || 'post'].bind(this.agent);

    return requestUrl(this.options.login.url)
    .send(body).endAsync().then((res) => this.saveCookies(res));
  }
}
