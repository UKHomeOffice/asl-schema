const expect = require('chai').expect;
const ProjectVersion = require('../../schema/project-version');
const ValidationError = require('objection/lib/model/ValidationError');

describe('ProjectVersion', () => {
  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      data: ['array', 'of', 'values']
    };
    expect(() => ProjectVersion.fromJson(badJson)).to.throw(ValidationError, /data: should be object,null/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      unknown: 'example'
    };
    expect(() => ProjectVersion.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      data: { a: 'b' }
    };
    expect(ProjectVersion.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      data: { c: 'd' },
      submittedAt: null,
      grantedAt: null
    };
    expect(ProjectVersion.fromJson(goodJson)).to.be.an('object');
  });
});
