import {Model} from 'objection';
import uuid from '../lib/regex-validation.js';

class EmailPreferences extends Model {
  static get tableName() {
    return 'emailPreferences';
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        preferences: { type: ['object', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'emailPreferences.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

export default EmailPreferences;
