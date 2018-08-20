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
        token: { type: 'string' },
        role: {
          type: 'string',
          enum: externalPermissions
        },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = Invitation;
