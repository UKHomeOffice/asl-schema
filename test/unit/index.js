const assert = require('assert');
const Schema = require('../../');

describe('Schema', () => {

  it('can initialise without error', () => {
    assert.equal(typeof Schema, 'function');
    assert.doesNotThrow(() => Schema({}));
  });

});
