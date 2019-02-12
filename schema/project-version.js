const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class ProjectVersion extends BaseModel {
  static get tableName() {
    return 'projectVersions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        data: { type: ['object', 'null'] },
        parentId: { type: ['string', 'null'], pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get(id) {
    return this.query()
      .findById(id)
      .eager('[children, parent]');
  }

  static get relationMappings() {
    return {
      children: {
        relation: this.HasManyRelation,
        modelClass: this,
        join: {
          from: 'projectVersions.id',
          to: 'projectVersions.parentId'
        }
      },
      parent: {
        relation: this.BelongsToOneRelation,
        modelClass: this,
        join: {
          from: 'projectVersions.parentId',
          to: 'projectVersions.id'
        }
      }
    };
  }

}

module.exports = ProjectVersion;
