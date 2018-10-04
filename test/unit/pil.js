const expect = require('chai').expect;
const Pil = require('../../schema/pil');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Pil', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      establishment_id: 'abcd-1234'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      establishment_id: 100,
      profile_id: '8EAF8190-2312-4EC9-A5A4-806ED573301F',
      status: 'ok'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when an invalid uuid is provided', () => {
    const badJson = {
      id: 'this is not a uuid v4',
      establishment_id: 100,
      profile_id: '8EAF8190-2312-4EC9-A5A4-806ED573301F',
      revocationDate: null
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /id: should match pattern/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      establishment_id: 100,
      profile_id: '8EAF8190-2312-4EC9-A5A4-806ED573301F',
      unknown: 'example'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      id: 'e19980f1-ebb7-4a1a-af57-8162736a1252',
      establishment_id: 100,
      profile_id: '8EAF8190-2312-4EC9-A5A4-806ED573301F'
    };
    expect(Pil.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      establishment_id: 100,
      profile_id: '8EAF8190-2312-4EC9-A5A4-806ED573301F',
      revocation_date: null
    };
    expect(Pil.fromJson(goodJson)).to.be.an('object');
  });
});
