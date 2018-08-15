const assert = require('assert');
const Role = require('../schema/role');

describe('Role', () => {
  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      establishmentId: '8201',
      type: 'super'
    };
    assert.throws(
      () => Role.fromJson(badJson),
      'ValidationError: status: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      establishmentId: '8201',
      type: 'pelh'
    };
    assert.equal(typeof Role.fromJson(goodJson), 'object');
  });
});
