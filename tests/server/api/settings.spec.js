'use strict';

const _           = require('lodash');
const expect      = require('chai').expect;
const APISettings = require('../../../server/settings');

describe('API settings', function() {

  describe('Admin', function() {

    it('Exposed paths should be "_id" and "email"', function() {
      const adminPaths = [ '_id', 'email' ];
      expect(_.difference(APISettings.Admin.paths, adminPaths)).to.be.empty;
      expect(_.difference(adminPaths, APISettings.Admin.paths)).to.be.empty;
    });

    it('List should be sorted in ascending order by "email"', function() {
      expect(APISettings.Admin.sort).to.have.keys([ 'email' ]);
      expect(APISettings.Admin.sort.email).and.equal('asc');
    });

  });

});
