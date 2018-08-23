const BaseModel = require('./base-model');
const { externalPermissions } = require('@asl/constants');

class Permission extends BaseModel {
  static get tableName() {
    return 'permissions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        role: { type: 'string', enum: externalPermissions },
        'created_at': { type: 'string', format: 'date-time' },
        'updated_at': { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }
}

module.exports = Permission;
