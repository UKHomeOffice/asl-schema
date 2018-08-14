const assert = require('assert');
const Invitation = require('../schema/invitation');

describe('Invitation', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    assert.throws(
      () => Invitation.fromJson(badJson),
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
      () => Invitation.fromJson(badJson),
      'ValidationError: type: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      role: 'basic',
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    assert.equal(typeof Invitation.fromJson(goodJson), 'object');
  });
});
