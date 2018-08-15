const assert = require('assert');
const Project = require('../schema/project');

describe('Project', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      status: 'active',
      issueDate: '2018-08-15'
    };
    assert.throws(
      () => Project.fromJson(badJson),
      'ValidationError: title: is a required property'
    );
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      title: 'Project X',
      status: 'delayed'
    };
    assert.throws(
      () => Project.fromJson(badJson),
      'ValidationError: status: should be equal to one of the allowed values'
    );
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      title: 'Project X',
      status: 'active'
    };
    assert.equal(typeof Project.fromJson(goodJson), 'object');
  });
});
