import {expect} from 'chai';
import {ValidationError} from 'objection';
import ProjectVersion from '../../schema/project-version.js';

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
});
