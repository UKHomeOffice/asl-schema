const expect = require('chai').expect;
const Role = require('../schema/role');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Role', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishmentId: 100,
      profileId: '1234567'
    };
    expect(() => Role.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      establishmentId: 100,
      profileId: '1234567',
      type: 'super'
    };
    expect(() => Role.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      establishmentId: 100,
      profileId: '1234567',
      type: 'pelh',
      unknown: 'example'
    };
    expect(() => Role.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      establishmentId: 100,
      profileId: '1234567',
      type: 'pelh'
    };
    expect(Role.fromJson(goodJson)).to.be.an('object');
  });
});
