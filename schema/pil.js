const BaseModel = require('./base-model');

class PIL extends BaseModel {
  static get tableName() {
    return 'pils';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        'migrated_id': { type: 'string' },
        status: {
          type: 'string',
          enum: ['active', 'pending', 'inactive', 'expired', 'revoked']
        },
        issueDate: { type: 'string' },
        revocationDate: { type: 'string' },
        licenceNumber: { type: 'string' },
        conditions: { type: 'string' },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' },
        establishmentId: { type: 'string' },
        profileId: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'pils.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'pils.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = PIL;
