'use strict';

var _        = require('lodash');
var expect   = require('chai').expect;
var mongoose = require('mongoose');

exports.prepareSeededObjects = function(seeded, paths, sortBy){
  var op = _(seeded)
  .map(function(item){
    item = _.pick(item, paths);
    item._id = item._id.toString();
    return item;
  });

  if (_.isFunction(sortBy)){
    op = op.sortBy(sortBy);
  }

  return op.value();
};

exports.seedingTimeout = function(testSuite, quantityToSeed, timeoutPerDocument){
  testSuite.timeout(quantityToSeed * (timeoutPerDocument || 1000));
};

exports.assertUnorderedArrays = function(anArray, anotherArray){
  if (_.isUndefined(anArray) || _.isNull(anArray)){
    return expect(anotherArray).to.not.exist;
  }

  expect(anArray).to.be.instanceof(Array);
  expect(anotherArray).to.be.instanceof(Array);
  expect(anArray).to.have.length(anotherArray.length);

  _.forEach(anArray, function(item){
    expect(anotherArray).to.include(item);
  });

  _.forEach(anotherArray, function(item){
    expect(anArray).to.include(item);
  });
};

exports.assertObjectIds = function(anId, anotherId){
  expect(mongoose.Types.ObjectId.isValid(anId));
  expect(mongoose.Types.ObjectId.isValid(anotherId));
  expect(anId.toString()).to.be.eql(anotherId.toString());
};
