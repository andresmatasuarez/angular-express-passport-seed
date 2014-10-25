'use strict';

var _           = require('lodash');
var expect      = require('chai').expect;
var APISettings = require('../../../server/routes/api/settings');

describe('API settings', function(){

  describe('User', function(){

    it('Expose paths should be "_id" and "email"', function(){
      var userPaths = [ '_id', 'email' ];
      expect(_.difference(APISettings.user.paths, userPaths)).to.be.empty;
      expect(_.difference(userPaths, APISettings.user.paths)).to.be.empty;
    });

    it('List should be sorted in ascending order by "email"', function(){
      expect(APISettings.user.sort).to.have.keys([ 'email' ]);
      expect(APISettings.user.sort.email).and.equal('asc');
    });

  });

});
