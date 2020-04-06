const BaseModel = require('./base-model');

class ProjectProfile extends BaseModel {
  static get tableName() {
    return 'project_profile';
  }

  static get idColumn() {
    return ['projectId', 'profileId'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['projectId', 'profileId'],
      additionalProperties: false,
      properties: {
        projectId: { type: 'string' },
        profileId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = ProjectProfile;
