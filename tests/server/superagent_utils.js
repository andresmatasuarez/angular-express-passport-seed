'use strict';

function SuperAgentUtils(agent) {
  this.agent = agent;
  this.jwt   = undefined;
}

SuperAgentUtils.prototype.withCookies = function(req) {
  this.agent.attachCookies(req);
  return req;
};

SuperAgentUtils.prototype.saveCookies = function(res) {
  this.agent.saveCookies(res);
  return res;
};

module.exports = SuperAgentUtils;
