'use strict';

const _           = require('lodash');
const expect      = require('chai').expect;
const APISettings = require('../../../server/settings');

describe('API settings', function() {

  describe('User', function() {

    it('Exposed paths should be "_id" and "email"', function() {
      const userPaths = [ '_id', 'email' ];
      expect(_.difference(APISettings.User.paths, userPaths)).to.be.empty;
      expect(_.difference(userPaths, APISettings.User.paths)).to.be.empty;
    });

    it('List should be sorted in ascending order by "email"', function() {
      expect(APISettings.User.sort).to.have.keys([ 'email' ]);
      expect(APISettings.User.sort.email).and.equal('asc');
    });

  });

});
