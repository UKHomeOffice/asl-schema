const BaseModel = require('./base-model');
const { uuid, date } = require('../lib/regex-validation');

class TrainingPil extends BaseModel {
  static get tableName() {
    return 'trainingPils';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['trainingCourseId', 'firstName', 'lastName', 'email'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        trainingCourseId: { type: 'string', pattern: uuid.v4 },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        dob: { type: 'string', pattern: date.yearMonthDay },
        trainingNeed: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      trainingCourse: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/trainingCourse`,
        join: {
          from: 'trainingPils.id',
          to: 'trainingCourses.trainingPilId'
        }
      }
    };
  }
}

module.exports = TrainingPil;
