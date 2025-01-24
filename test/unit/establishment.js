const expect = require('chai').expect;
const Establishment = require('../../schema/establishment');
const { ValidationError } = require('objection');

describe('Establishment', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      id: 80001,
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      id: 80001,
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'france'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when an invalid issue date is provided', () => {
    const badJson = {
      id: 80001,
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england',
      issueDate: '2018-47-92T18:00:00Z'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /issueDate: must match format/);
  });

  it('throws a validation error when unknown values are provided', () => {
    const badJson = {
      id: 80001,
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england',
      unknown: 'example'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /must NOT have additional properties/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      id: 80001,
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england',
      issueDate: '2018-02-17T18:00:00Z'
    };
    expect(Establishment.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      id: 80001,
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england',
      revocationDate: null,
      licenceNumber: null
    };
    expect(Establishment.fromJson(goodJson)).to.be.an('object');
  });
});
