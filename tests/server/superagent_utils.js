'use strict';

function SuperAgentUtils(agent, options) {
  this.agent   = agent;
  this.jwt     = undefined;
  this.options = options;
}

SuperAgentUtils.prototype.withCookies = function(req) {
  this.agent.attachCookies(req);
  return req;
};

SuperAgentUtils.prototype.saveCookies = function(res) {
  this.agent.saveCookies(res);
  return res;
};

SuperAgentUtils.prototype.performLogin = function(username, password) {
  const body = {};

  // Build request body
  body[this.options.login.usernameField || 'username'] = username;
  body[this.options.login.passwordField || 'password'] = password;

  const requestUrl = this.agent[this.options.login.method || 'post'].bind(this.agent);

  return requestUrl(this.options.login.url)
  .send(body).endAsync().then((res) => this.saveCookies(res));
};

module.exports = SuperAgentUtils;
