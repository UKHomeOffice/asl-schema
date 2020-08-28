const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');
const { pilStatuses } = require('@asl/constants');

class TrainingPil extends BaseModel {
  static get tableName() {
    return 'trainingPils';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['trainingCourseId', 'profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        trainingCourseId: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        status: { type: 'string', enum: pilStatuses },
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
        modelClass: `${__dirname}/training-course`,
        join: {
          from: 'trainingPils.trainingCourseId',
          to: 'trainingCourses.id'
        }
      },
      profile: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'trainingPils.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = TrainingPil;
