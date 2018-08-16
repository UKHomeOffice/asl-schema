const expect = require('chai').expect;
const Establishment = require('../schema/establishment');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Establishment', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'france'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown values are provided', () => {
    const badJson = {
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england',
      unknown: 'example'
    };
    expect(() => Establishment.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england'
    };
    expect(Establishment.fromJson(goodJson)).to.be.an('object');
  });
});
