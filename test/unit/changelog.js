import {expect} from 'chai';
import {ValidationError} from 'objection';
import Changelog from '../../schema/changelog.js';

describe('Changelog', () => {
  it('throws a validation error when required properties are missing', () => {
    const badJson = {};
    expect(() => Changelog.fromJson(badJson)).to.throw(ValidationError, /required/);
  });

  it('throws a validation error when invalid values are provided', () => {
    const badJson = {
      messageId: '75b1437e-649a-4fcf-9cdd-974fb746684c',
      changedBy: '777f8606-9404-47af-9029-a947b4fba604',
      modelId: '61380914-5596-4ef1-9d20-a83e11b53c3b',
      modelType: 12345,
      action: 'update',
      state: {
        a: 'field',
        b: 'field'
      }
    };
    expect(() => Changelog.fromJson(badJson)).to.throw(ValidationError, /modelType: should be string/);
  });

  it('throws a validation error when an invalid messageId is provided', () => {
    const badJson = {
      messageId: 'invalid messageId',
      changedBy: '777f8606-9404-47af-9029-a947b4fba604',
      modelId: '61380914-5596-4ef1-9d20-a83e11b53c3b',
      modelType: 'place',
      action: 'update',
      state: {
        a: 'field',
        b: 'field'
      }
    };
    expect(() => Changelog.fromJson(badJson)).to.throw(ValidationError, /messageId: should match pattern/);
  });

  it('throws a validation error when unknown values are provided', () => {
    const badJson = {
      messageId: '75b1437e-649a-4fcf-9cdd-974fb746684c',
      changedBy: '777f8606-9404-47af-9029-a947b4fba604',
      modelId: '61380914-5596-4ef1-9d20-a83e11b53c3b',
      modelType: 'place',
      action: 'update',
      state: {
        a: 'field',
        b: 'field'
      },
      unknown: 'field'
    };
    expect(() => Changelog.fromJson(badJson)).to.throw(ValidationError, /invalid additional property/);
  });

  it('successfully instantiates when given a valid schema', () => {
    const goodJson = {
      messageId: '75b1437e-649a-4fcf-9cdd-974fb746684c',
      changedBy: '777f8606-9404-47af-9029-a947b4fba604',
      modelId: '61380914-5596-4ef1-9d20-a83e11b53c3b',
      modelType: 'place',
      action: 'update',
      state: {
        a: 'field',
        b: 'field'
      }
    };
    expect(Changelog.fromJson(goodJson)).to.be.an('object');
  });

  it('allows null values for non-required fields', () => {
    const goodJson = {
      establishmentId: null,
      messageId: '75b1437e-649a-4fcf-9cdd-974fb746684c',
      changedBy: '777f8606-9404-47af-9029-a947b4fba604',
      modelId: '61380914-5596-4ef1-9d20-a83e11b53c3b',
      modelType: 'place',
      action: 'update',
      state: {
        a: 'field',
        b: 'field'
      }
    };
    expect(Changelog.fromJson(goodJson)).to.be.an('object');
  });
});
