'use strict';

module.exports = function(agent){
  return {
    withCookies: function(req){
      agent.attachCookies(req);
      return req;
    },

    saveCookies: function(res){
      agent.saveCookies(res);
      return res;
    }
  };
};
