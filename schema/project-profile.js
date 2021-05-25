const BaseModel = require('./base-model');

class ProjectProfile extends BaseModel {
  static get tableName() {
    return 'projectProfiles';
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
        role: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'projectProfiles.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = ProjectProfile;
