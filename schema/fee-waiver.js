import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import Profile from './profile.js';
import Establishment from './establishment.js';

const {uuid} = regex;
class FeeWaiver extends BaseModel {
  static get tableName() {
    return 'pilFeeWaivers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profileId', 'establishmentId', 'year'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        year: { type: 'integer' },
        comment: { type: 'string' },
        waivedById: { type: 'string', pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'pilFeeWaivers.profileId',
          to: 'profiles.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'pilFeeWaivers.establishmentId',
          to: 'establishments.id'
        }
      },
      waivedBy: {
        relation: this.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'pilFeeWaivers.waivedById',
          to: 'profiles.id'
        }
      }
    };
  }
}

export default FeeWaiver;
