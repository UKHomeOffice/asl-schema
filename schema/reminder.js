import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import Establishment from './establishment.js';
import Pil from './pil.js';
import ReminderDismissed from './reminder-dismissed.js';
import Project from './project.js';
const {uuid} = regex;
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
        modelClass: Establishment,
        join: {
          from: 'reminders.establishmentId',
          to: 'establishments.id'
        }
      },
      pil: {
        relation: this.BelongsToOneRelation,
        modelClass: Pil,
        join: {
          from: 'reminders.modelId',
          to: 'pils.id'
        }
      },
      project: {
        relation: this.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: 'reminders.modelId',
          to: 'projects.id'
        }
      },
      dismissed: {
        relation: this.HasManyRelation,
        modelClass: ReminderDismissed,
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

export default Reminder;
