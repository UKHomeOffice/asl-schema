const expect = require('chai').expect;
const Invitation = require('../../schema/invitation');
const { ValidationError } = require('objection');

describe('Invitation', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishmentId: 100,
      email: 'test@example.com'
    };
    expect(() => Invitation.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      role: 'super',
      token: 'abc123',
      establishmentId: 100,
      email: 'test@example.com'
    };
    expect(() => Invitation.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      role: 'basic',
      token: 'abc123',
      establishmentId: 100,
      email: 'test@example.com',
      unknown: 'example'
    };
    expect(() => Invitation.fromJson(badJson)).to.throw(ValidationError, /must NOT have additional properties/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      role: 'basic',
      token: 'abc123',
      establishmentId: 100,
      email: 'test@example.com'
    };
    expect(Invitation.fromJson(goodJson)).to.be.an('object');
  });
});
