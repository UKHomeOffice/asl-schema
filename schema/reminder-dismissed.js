const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class ReminderDismissed extends BaseModel {

  static get tableName() {
    return 'reminderDismissed';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        reminderId: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      reminder: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/reminder`,
        join: {
          from: 'reminderDismissed.modelId',
          to: 'reminders.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'reminderDismissed.profileId',
          to: 'profiles.id'
        }
      }
    };
  }

  static count() {
    return this.query()
      .countDistinct('reminderDismissed.id')
      .then(results => results[0].count);
  }

}

module.exports = ReminderDismissed;
