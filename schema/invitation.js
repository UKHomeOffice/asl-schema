const BaseModel = require('./base-model');
const aslConstants = require('@asl/constants');

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
          enum: aslConstants.externalPermissions
        },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' },
        establishmentId: { type: 'string' },
        profileId: { type: 'string' }
      }
    };
  }
}

module.exports = Invitation;
