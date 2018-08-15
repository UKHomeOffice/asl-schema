const expect = require('chai').expect;
const Permission = require('../schema/permission');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Permission', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    expect(() => Permission.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      role: 'super',
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    expect(() => Permission.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      role: 'basic',
      establishmentId: 'abcd-1234',
      profileId: '1234567'
    };
    expect(Permission.fromJson(goodJson)).to.be.an('object');
  });
});
