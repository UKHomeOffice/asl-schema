const assert = require('assert');
const { transform } = require('../../migrations/20200710110948_training_and_education_ppls_false');

describe('Training PPLs migration', () => {

  describe('transform', () => {

    it('sets `training-licence` to false if not included in permissible purpose', () => {
      const input = {
        'permissible-purpose': ['basic-research']
      };
      assert.equal(transform(input)['training-licence'], false);
    });

    it('sets `training-licence` to false if no permissible purpose is set', () => {
      const input = {};
      assert.equal(transform(input)['training-licence'], false);
    });

    it('sets `training-licence` to true if permissible purpose includes `higher-education`', () => {
      const input = {
        'permissible-purpose': ['basic-research', 'higher-education']
      };
      assert.equal(transform(input)['training-licence'], true);
    });

    it('preserves `permissible-purpose` property', () => {
      const input = {
        'permissible-purpose': ['basic-research', 'higher-education']
      };
      assert.deepEqual(transform(input)['permissible-purpose'], ['basic-research', 'higher-education']);
    });

    it('preserves other properties', () => {
      const input = {
        title: 'Test project title',
        'permissible-purpose': ['basic-research', 'higher-education']
      };
      assert.equal(transform(input).title, 'Test project title');
    });

  });

});