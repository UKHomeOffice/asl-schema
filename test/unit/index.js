import assert from 'assert';
import Schema from '../../schema/index.js';

describe('Schema', () => {

  it('can initialise without error', () => {
    assert.equal(typeof Schema, 'function');
    assert.doesNotThrow(() => Schema({}));
  });

});
