const expect = require('chai').expect;
const Pil = require('../schema/pil');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Pil', () => {
  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      status: 'ok'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      status: 'active',
      issueDate: '2018-08-14T09:00:00Z',
      unknown: 'example'
    };
    expect(() => Pil.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      status: 'active',
      issueDate: '2018-08-14T09:00:00Z'
    };
    expect(Pil.fromJson(goodJson)).to.be.an('object');
  });
});
