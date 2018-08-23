const expect = require('chai').expect;
const Authorisation = require('../../schema/authorisation'); // BaseModel has no schema of it's own
const ValidationError = require('../../schema/validation-error');

describe('BaseModel', () => {
  it('provides a validation method which returns a validation error instead of throwing', () => {
    const badJson = {};
    expect(Authorisation.validate(badJson)).to.be.an.instanceof(ValidationError);
  });
});
