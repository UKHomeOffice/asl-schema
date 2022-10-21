const { Model } = require('objection');
const { uuid } = require('../lib/regex-validation');

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
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'profileMergeLog.fromProfileId',
          to: 'profiles.id'
        }
      },
      toProfile: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'profileMergeLog.toProfileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = ProfileMergeLog;
