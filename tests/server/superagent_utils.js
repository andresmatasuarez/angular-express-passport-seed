'use strict';

var SuperAgentUtils = function(agent){
  this.agent = agent;
  this.jwt   = undefined;
};

SuperAgentUtils.prototype.withCookies = function(req){
  this.agent.attachCookies(req);
  return req;
};

SuperAgentUtils.prototype.saveCookies = function(res){
  this.agent.saveCookies(res);
  return res;
};

SuperAgentUtils.prototype.withJWT = function(req){
  req.set('Authorization', 'Bearer ' + this.jwt);
  return req;
};

SuperAgentUtils.prototype.saveJWT = function(res){
  this.jwt = res.body.token;
  return res;
};

SuperAgentUtils.prototype.resetJWT = function(){
  this.jwt = undefined;
};

module.exports = SuperAgentUtils;
