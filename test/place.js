const assert = require('assert');
const Place = require('../schema/place');

describe('Place', () => {
  it('throws a validation error when invalid array values are provided', () => {
    const badJson = {
      suitability: [1, 2]
    };
    assert.throws(
      () => Place.fromJson(badJson),
      'ValidationError: suitability[0]: should be string, suitability[1]: should be string'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      site: 'Lunar House 3rd floor',
      area: '6.08',
      name: '94382',
      suitability: ['NHP', 'CAT', 'DOG']
    };
    assert.equal(typeof Place.fromJson(goodJson), 'object');
  });
});
