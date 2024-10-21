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
        coursePurpose: { type: 'string', enum: ['higher-education', 'training'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }

  static list({ establishmentId, sort = {}, limit, offset }) {
    let query = this.query()
      .select([
        'trainingCourses.*',
        this.relatedQuery('trainingPils')
          .count()
          .as('applications'),
        this.relatedQuery('trainingPils')
          .whereNot({ status: 'inactive' })
          .count()
          .as('licences')
      ])
      .where({ 'trainingCourses.establishmentId': establishmentId })
      .leftJoinRelated('project')
      .withGraphFetched('project');

    if (sort.column) {
      query = this.orderBy({ query, sort });
    }

    query = this.paginate({ query, limit, offset });

    return query;
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
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'trainingCourses.establishmentId',
          to: 'establishments.id'
        }
      }
    };
  }
}

module.exports = TrainingCourse;
