import {pilStatuses} from '@ukhomeoffice/asl-constants';
import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import TrainingCourse from './training-course.js';
import Profile from './profile.js';

const { uuid } = regex;
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
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        expiryDate: { type: ['string', 'null'], format: 'date-time' },
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
        modelClass: TrainingCourse,
        join: {
          from: 'trainingPils.trainingCourseId',
          to: 'trainingCourses.id'
        }
      },
      profile: {
        relation: this.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'trainingPils.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

export default TrainingPil;
