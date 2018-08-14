const assert = require('assert');
const Establishment = require('../schema/establishment');

describe('Establishment', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk'
    };
    assert.throws(
      () => Establishment.fromJson(badJson),
      'ValidationError: name: is a required property'
    );
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'france'
    };
    assert.throws(
      () => Establishment.fromJson(badJson),
      'ValidationError: country: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      name: 'University of Croydon',
      address: 'University of Croydon',
      email: 'vice-chancellor@croydon.ac.uk',
      country: 'england'
    };
    assert.equal(typeof Establishment.fromJson(goodJson), 'object');
  });
});
