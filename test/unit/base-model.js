import {expect} from 'chai';
import Authorisation from '../../schema/authorisation.js'; // BaseModel has no schema of it's own
import ValidationError from '../../schema/validation-error.js';

describe('BaseModel', () => {
  it('provides a validation method which returns a validation error instead of throwing', () => {
    const badJson = {};
    expect(Authorisation.validate(badJson)).to.be.an.instanceof(ValidationError);
  });
});
