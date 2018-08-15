const assert = require('assert');
const Pil = require('../schema/pil');

describe('Pil', () => {
  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      status: 'ok'
    };
    assert.throws(
      () => Pil.fromJson(badJson),
      'ValidationError: status: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      status: 'active',
      issueDate: '2018-08-14T09:00:00Z'
    };
    assert.equal(typeof Pil.fromJson(goodJson), 'object');
  });
});
