const expect = require('chai').expect;
const ValidationError = require('../../schema/validation-error');
const { ValidationError: ObjectionValidationError } = require('objection');

describe('ValidationError', () => {
  it('can be instantiated with a message string', () => {
    const error = new ValidationError('this is an error');
    expect(error.message).to.equal('this is an error');
  });

  it('can be instantiated with an error object', () => {
    const error = new ValidationError({ message: 'this is an error' });
    expect(error.message).to.equal('this is an error');
  });

  it('can be instantiated with an objection ValidationError object', () => {
    const objectionError = new ObjectionValidationError({ message: 'this is an error' });
    const error = new ValidationError(objectionError);
    expect(error.message).to.equal('this is an error');
  });

  it('has a default error message', () => {
    const error = new ValidationError();
    expect(error.message).to.equal('validation error');
  });

  it('has a default status code', () => {
    const error = new ValidationError();
    expect(error.status).to.equal(400);
  });
});
