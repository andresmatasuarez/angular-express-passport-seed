'use strict';

const _        = require('lodash');
const expect   = require('chai').expect;
const mongoose = require('mongoose');

const DEFAULT_SEEDING_TIMEOUT_PER_DOCUMENT = 1000;

exports.prepareSeededObjects = function(seeded, paths, sortBy) {
  let op = _(seeded)
  .map(function(item) {
    item = _.pick(item.toJSON(), paths);
    item._id = item._id.toString();
    return item;
  });

  if (_.isFunction(sortBy)) {
    op = op.sortBy(sortBy);
  }

  return op.value();
};

exports.seedingTimeout = function(testSuite, quantityToSeed, timeoutPerDocument) {
  timeoutPerDocument = timeoutPerDocument || DEFAULT_SEEDING_TIMEOUT_PER_DOCUMENT;
  testSuite.timeout(quantityToSeed * timeoutPerDocument);
};

exports.assertUnorderedArrays = function(anArray, anotherArray) {
  if (_.isUndefined(anArray) || _.isNull(anArray)) {
    return expect(anotherArray).to.not.exist;
  }

  expect(anArray).to.be.instanceof(Array);
  expect(anotherArray).to.be.instanceof(Array);
  expect(anArray).to.have.length(anotherArray.length);

  _.forEach(anArray, function(item) {
    expect(anotherArray).to.include(item);
  });

  _.forEach(anotherArray, function(item) {
    expect(anArray).to.include(item);
  });
};

exports.assertObjectIds = function(anId, anotherId) {
  expect(mongoose.Types.ObjectId.isValid(anId));
  expect(mongoose.Types.ObjectId.isValid(anotherId));
  expect(anId.toString()).to.be.eql(anotherId.toString());
};
