const BaseModel = require('./base-model');
const { uuid, date } = require('../lib/regex-validation');

class TrainingCourse extends BaseModel {
  static get tableName() {
    return 'trainingCourses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['projectId', 'establishmentId', 'title', 'startDate'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        projectId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        species: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        startDate: { type: ['string', 'null'], pattern: date.yearMonthDay },
        title: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      project: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'trainingCourses.projectId',
          to: 'projects.id'
        }
      },
      trainingPils: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/training-pil`,
        join: {
          from: 'trainingCourses.id',
          to: 'trainingPils.trainingCourseId'
        }
      }
    };
  }
}

module.exports = TrainingCourse;
