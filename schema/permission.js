const BaseModel = require('./base-model');

class Permission extends BaseModel {
  static get tableName() {
    return 'permissions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'establishmentId', 'profileId'],
      properties: {
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

module.exports = Permission;
