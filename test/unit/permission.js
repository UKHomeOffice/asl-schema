import {expect} from 'chai';
import {ValidationError} from 'objection';
import Permission from '../../schema/permission.js';

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

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      role: 'basic',
      establishmentId: 100,
      profileId: '1234567',
      unknown: 'example'
    };
    expect(() => Permission.fromJson(badJson)).to.throw(ValidationError, /must NOT have additional properties/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      role: 'basic',
      establishmentId: 100,
      profileId: '1234567'
    };
    expect(Permission.fromJson(goodJson)).to.be.an('object');
  });
});
