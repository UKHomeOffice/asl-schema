const expect = require('chai').expect;
const Authorisation = require('../../schema/authorisation');
const { ValidationError } = require('objection');

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
      description: 'Rehome in a certified sanctuary',
      establishmentId: 100
    };
    expect(() => Authorisation.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when an invalid uuid is provided', () => {
    const badJson = {
      id: 'this is not a uuid v4',
      type: 'rehomes',
      method: 'Placement in sanctuary',
      description: 'Rehome in a certified sanctuary',
      establishmentId: 100
    };
    expect(() => Authorisation.fromJson(badJson)).to.throw(ValidationError, /id: must match pattern/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      type: 'rehomes',
      method: 'Placement in sanctuary',
      description: 'Rehome in a certified sanctuary',
      establishmentId: 100,
      unknown: 'example'
    };
    expect(() => Authorisation.fromJson(badJson)).to.throw(ValidationError, /must NOT have additional properties/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      id: 'e19980f1-ebb7-4a1a-af57-8162736a1252',
      type: 'rehomes',
      method: 'Placement in sanctuary',
      description: 'Rehome in a certified sanctuary',
      establishmentId: 100
    };
    expect(Authorisation.fromJson(goodJson)).to.be.an('object');
  });
});
