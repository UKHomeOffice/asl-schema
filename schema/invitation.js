const BaseModel = require('./base-model');
const { externalPermissions } = require('@asl/constants');

class Invitation extends BaseModel {
  static get tableName() {
    return 'invitations';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        token: { type: ['string', 'null'] },
        role: {
          type: 'string',
          enum: externalPermissions
        },
        'created_at': { type: ['string', 'null'] },
        'updated_at': { type: ['string', 'null'] },
        establishmentId: { type: 'string' },
        profileId: { type: 'string' }
      }
    };
  }
}

module.exports = Invitation;
