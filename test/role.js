const expect = require('chai').expect;
const Role = require('../schema/role');
const ValidationError = require('objection/lib/model/ValidationError');

describe('Role', () => {
  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      establishmentId: '8201',
      type: 'super'
    };
    expect(() => Role.fromJson(badJson)).to.throw(ValidationError, /allowed values/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      establishmentId: '8201',
      type: 'pelh'
    };
    expect(Role.fromJson(goodJson)).to.be.an('object');
  });
});
