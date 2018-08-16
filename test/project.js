const expect = require('chai').expect;
const Project = require('../schema/project');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Project', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      status: 'active',
      issueDate: '2018-08-15'
    };
    expect(() => Project.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      title: 'Project X',
      status: 'delayed'
    };
    expect(() => Project.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      title: 'Project X',
      status: 'active',
      unknown: 'example'
    };
    expect(() => Project.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      title: 'Project X',
      status: 'active'
    };
    expect(Project.fromJson(goodJson)).to.be.an('object');
  });
});
