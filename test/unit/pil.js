const expect = require('chai').expect;
const Pil = require('../../schema/pil');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Pil', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishmentId: 'abcd-1234'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      establishmentId: 100,
      profileId: 'abcd1234',
      status: 'ok'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      establishmentId: 100,
      profileId: 'abcd1234',
      unknown: 'example'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      establishmentId: 100,
      profileId: 'abcd1234'
    };
    expect(Pil.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      establishmentId: 100,
      profileId: 'abcd1234',
      revocationDate: null
    };
    expect(Pil.fromJson(goodJson)).to.be.an('object');
  });
});
