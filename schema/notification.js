import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import Profile from './profile.js';

const { uuid } = regex;
class Notification extends BaseModel {
  static get tableName() {
    return 'notifications';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        profileId: { type: ['string', 'null'], pattern: uuid.v4 },
        to: { type: 'string', format: 'email' },
        name: { type: 'string' },
        subject: { type: 'string' },
        html: { type: 'string' },
        identifier: { type: 'string' },
        completed: { type: ['string', 'null'], format: 'date-time' },
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
        modelClass: Profile,
        join: {
          from: 'notifications.profileId',
          to: 'profiles.id'
        }
      }
    };
  }

}

export default Notification;
