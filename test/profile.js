const assert = require('assert');
const Profile = require('../schema/profile');

describe('Profile', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      title: 'Ms',
      firstName: 'Jane',
      lastName: 'Doe'
    };
    assert.throws(
      () => Profile.fromJson(badJson),
      'ValidationError: email: is a required property'
    );
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      telephone: 123456789
    };
    assert.throws(
      () => Profile.fromJson(badJson),
      'ValidationError: telephone: should be string'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com'
    };
    assert.equal(typeof Profile.fromJson(goodJson), 'object');
  });
});
