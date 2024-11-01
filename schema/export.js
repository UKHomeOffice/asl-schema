import BaseModel from './base-model.js';
import uuid from '../lib/regex-validation.js';

class Export extends BaseModel {
  static get tableName() {
    return 'exports';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        type: { type: 'string' },
        key: { type: 'string' },
        ready: { type: 'boolean' },
        meta: { type: ['object', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'exports.profileId',
          to: 'profiles.id'
        }
      }
    };
  }

}

export default Export;
