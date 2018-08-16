const expect = require('chai').expect;
const Authorisation = require('../schema/authorisation');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Authorisation', () => {
  it('throws a validation error when empty', () => {
    const badJson = {};
    expect(() => Authorisation.fromJson(badJson)).to.throw();
  });

  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      method: 'Placement in sanctuary'
    };
    expect(() => Authorisation.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      type: 'placement',
      method: 'Placement in sanctuary',
      description: 'Rehome in a certified sanctuary'
    };
    expect(() => Authorisation.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      type: 'rehomes',
      method: 'Placement in sanctuary',
      description: 'Rehome in a certified sanctuary',
      unknown: 'example'
    };
    expect(() => Authorisation.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      type: 'rehomes',
      method: 'Placement in sanctuary',
      description: 'Rehome in a certified sanctuary'
    };
    expect(Authorisation.fromJson(goodJson)).to.be.an('object');
  });
});
