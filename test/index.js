const assert = require('assert');
const Schema = require('../schema');

describe('Schema', () => {

  it('can initialise without error', () => {
    assert.equal(typeof Schema, 'function');
  });

});
