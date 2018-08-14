const BaseModel = require('./base-model');

class Invitation extends BaseModel {
  static get tableName() {
    return 'invitations';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'establishmentId', 'profileId'],
      properties: {
        token: { type: 'string' },
        role: {
          type: 'string',
          enum: ['basic', 'read', 'admin']
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
