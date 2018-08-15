const expect = require('chai').expect;
const Place = require('../schema/place');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Place', () => {
  it('throws a validation error when invalid array values are provided', () => {
    const badJson = {
      suitability: [1, 2]
    };
    expect(() => Place.fromJson(badJson)).to.throw(ValidationError, /should be string/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      site: 'Lunar House 3rd floor',
      area: '6.08',
      name: '94382',
      suitability: ['NHP', 'CAT', 'DOG']
    };
    expect(Place.fromJson(goodJson)).to.be.an('object');
  });
});
