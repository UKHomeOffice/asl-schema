const expect = require('chai').expect;
const Profile = require('../../schema/profile');
const { ValidationError } = require('objection');

describe('Profile', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {
      title: 'Ms',
      firstName: 'Jane',
      lastName: 'Doe'
    };
    expect(() => Profile.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      telephone: 123456789
    };
    expect(() => Profile.fromJson(badJson)).to.throw(ValidationError, /should be string/);
  });

  it('throws a validation error when invalid email is provided', () => {
    const badJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.com',
      dob: '2000-40-89'
    };
    expect(() => Profile.fromJson(badJson)).to.throw(ValidationError, /should match pattern/);
  });

  it('throws a validation error when invalid dob is provided', () => {
    const badJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      dob: '2000-40-89'
    };
    expect(() => Profile.fromJson(badJson)).to.throw(ValidationError, /should match pattern/);
  });

  it('throws a validation error when unknown properties are provided', () => {
    const badJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      unknown: 'example'
    };
    expect(() => Profile.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      dob: '1974-01-21'
    };
    expect(Profile.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      title: null
    };
    expect(Profile.fromJson(goodJson)).to.be.an('object');
  });
});
