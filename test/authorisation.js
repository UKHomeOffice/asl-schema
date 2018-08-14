const assert = require('assert');
const Authorisation = require('../schema/authorisation');

describe('Authorisation', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      method: 'Placement in sanctuary'
    };
    assert.throws(
      () => Authorisation.fromJson(badJson),
      'ValidationError: type: is a required property'
    );
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      type: 'petting'
    };
    assert.throws(
      () => Authorisation.fromJson(badJson),
      'ValidationError: type: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      type: 'rehomes',
      method: 'Placement in sanctuary'
    };
    assert.equal(typeof Authorisation.fromJson(goodJson), 'object');
  });
});
