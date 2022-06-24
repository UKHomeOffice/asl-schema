const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class Reminder extends BaseModel {

  static get tableName() {
    return 'reminders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        deadline: { type: 'string', format: 'date' },
        modelType: { type: 'string' },
        modelId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        conditionKey: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'active'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'reminders.establishmentId',
          to: 'establishments.id'
        }
      },
      pil: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'reminders.modelId',
          to: 'pils.id'
        }
      },
      project: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'reminders.modelId',
          to: 'projects.id'
        }
      },
      dismissed: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/reminder-dismissed`,
        join: {
          from: 'reminders.id',
          to: 'reminderDismissed.reminderId'
        }
      }
    };
  }

  static count() {
    return this.query()
      .countDistinct('reminders.id')
      .then(results => results[0].count);
  }

}

module.exports = Reminder;
