const assert = require('assert');
const uuid = require('uuid/v4');
const isuuid = require('uuid-validate');
const { cloneDeep, omit } = require('lodash');
const { transform } = require('../../migrations/20200323140559_speciesdetails_ids');

describe('transform', () => {

  it('returns undefined if passed a falsy data blob', () => {
    assert.equal(transform(), undefined);
  });

  it('returns untouched input if input has no protocols', () => {
    const input = {
      title: 'Test title'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has empty protocols', () => {
    const input = {
      title: 'Test title',
      protocols: []
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has non-array protocols', () => {
    const input = {
      title: 'Test title',
      protocols: 'This should not be possible'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have no species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1' },
        { title: 'Protocol 2' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have non-array species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', speciesDetails: 'also not theoretically possible' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have empty species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', speciesDetails: [] }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('adds id properties to speciesDetails on protocols where they are missing', () => {
    const input = {
      title: 'Test title',
      protocols: [
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' } ]
        },
        {
          title: 'Protocol 2',
          speciesDetails: [ { value: 'mice' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);
    assert.deepEqual(omit(output, 'protocols'), omit(expected, 'protocols'), 'non protocol data should be untouched');
    assert.deepEqual(output.protocols[0], expected.protocols[0], 'first protocol should be untouched');

    assert.deepEqual(omit(output.protocols[1], 'speciesDetails'), omit(expected.protocols[1], 'speciesDetails'), 'non speciesDetails data on second protocol should be untouched');

    assert.equal(output.protocols[1].speciesDetails[0].value, 'mice');
    assert.ok(isuuid(output.protocols[1].speciesDetails[0].id));
  });

  it('handles some speciesDetails on a single protocol having missing ids', () => {
    const input = {
      title: 'Test title',
      protocols: [
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' }, { value: 'rats' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);

    assert.ok(output.protocols[0].speciesDetails.every(sd => isuuid(sd.id)), 'all speciesDetails should have id: uuid');
  });

});
