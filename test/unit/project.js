const expect = require('chai').expect;
const Project = require('../../schema/project');
const { ValidationError } = require('objection');

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
      status: 'delayed',
      establishmentId: 100
    };
    expect(() => Project.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      title: 'Project X',
      establishmentId: 100,
      unknown: 'example'
    };
    expect(() => Project.fromJson(badJson)).to.throw(ValidationError, /must NOT have additional properties/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      title: 'Project X',
      establishmentId: 100
    };
    expect(Project.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      title: 'Project X',
      establishmentId: 100,
      revocationDate: null
    };
    expect(Project.fromJson(goodJson)).to.be.an('object');
  });
});
