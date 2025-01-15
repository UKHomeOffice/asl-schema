const expect = require('chai').expect;
const Place = require('../../schema/place');
const { ValidationError } = require('objection');

describe('Place', () => {
  it('throws a validation error when invalid array values are provided', () => {
    const badJson = {
      site: 'Lunar House 3rd floor',
      name: '94382',
      suitability: [1, 2],
      holding: ['STH', 'LTH'],
      establishmentId: 100
    };
    expect(() => Place.fromJson(badJson)).to.throw(ValidationError, /must be string/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      site: 'Lunar House 3rd floor',
      name: '94382',
      suitability: ['NHP', 'CAT', 'DOG'],
      holding: ['STH', 'LTH'],
      establishmentId: 100,
      unknown: 'example'
    };
    expect(() => Place.fromJson(badJson)).to.throw(ValidationError, /must NOT have additional properties/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      site: 'Lunar House 3rd floor',
      area: '6.08',
      name: '94382',
      suitability: ['NHP', 'CAT', 'DOG'],
      holding: ['STH', 'LTH'],
      establishmentId: 100
    };
    expect(Place.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      site: 'Lunar House 3rd floor',
      area: '6.08',
      name: '94382',
      suitability: ['NHP', 'CAT', 'DOG'],
      holding: ['STH', 'LTH'],
      establishmentId: 100,
      restrictions: null
    };
    expect(Place.fromJson(goodJson)).to.be.an('object');
  });
});
