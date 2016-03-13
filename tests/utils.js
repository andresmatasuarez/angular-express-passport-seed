import _        from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';

const DEFAULT_SEEDING_TIMEOUT_PER_DOCUMENT = 1000;

export function prepareSeededObjects(seeded, paths, sortBy) {
  let op = _(seeded)
  .map((item) => {
    const i = _.pick(item.toJSON(), paths);
    i._id = i._id.toString();
    return i;
  });

  if (_.isFunction(sortBy)) {
    op = op.sortBy(sortBy);
  }

  return op.value();
}

export function seedingTimeout(testSuite, quantityToSeed, timeoutPerDocument) {
  testSuite.timeout(quantityToSeed * (timeoutPerDocument || DEFAULT_SEEDING_TIMEOUT_PER_DOCUMENT));
}

export function assertUnorderedArrays(anArray, anotherArray) {
  if (_.isUndefined(anArray) || _.isNull(anArray)) {
    expect(anotherArray).to.not.exist;
  } else {
    expect(anArray).to.be.instanceof(Array);
    expect(anotherArray).to.be.instanceof(Array);
    expect(anArray).to.have.length(anotherArray.length);

    _.forEach(anArray, (item) => {
      expect(anotherArray).to.include(item);
    });

    _.forEach(anotherArray, (item) => {
      expect(anArray).to.include(item);
    });
  }
}

export function assertObjectIds(anId, anotherId) {
  expect(mongoose.Types.ObjectId.isValid(anId));
  expect(mongoose.Types.ObjectId.isValid(anotherId));
  expect(anId.toString()).to.be.eql(anotherId.toString());
}
