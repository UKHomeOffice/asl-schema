import {Model} from 'objection';
import regex from '../lib/regex-validation.js';
import Profile from './profile.js';

const {uuid} = regex;
class ProfileMergeLog extends Model {
  static get tableName() {
    return 'profileMergeLog';
  }

  $beforeUpdate(opt, context) {
    if (!context.preserveUpdatedAt) {
      this.updatedAt = new Date().toISOString();
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['fromProfileId', 'toProfileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        fromProfileId: { type: 'string' },
        toProfileId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      fromProfile: {
        relation: this.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'profileMergeLog.fromProfileId',
          to: 'profiles.id'
        }
      },
      toProfile: {
        relation: this.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'profileMergeLog.toProfileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

export default ProfileMergeLog;
