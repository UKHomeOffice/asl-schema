const assert = require('assert');
const Permission = require('../schema/permission');

describe('Permission', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    assert.throws(
      () => Permission.fromJson(badJson),
      'ValidationError: role: is a required property'
    );
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      role: 'super',
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    assert.throws(
      () => Permission.fromJson(badJson),
      'ValidationError: type: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      role: 'basic',
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    assert.equal(typeof Permission.fromJson(goodJson), 'object');
  });
});
