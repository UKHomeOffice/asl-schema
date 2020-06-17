const BaseModel = require('./base-model');

class PlaceRole extends BaseModel {
  static get tableName() {
    return 'placeRoles';
  }

  static get idColumn() {
    return ['placeId', 'roleId'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['placeId', 'roleId'],
      additionalProperties: false,
      properties: {
        placeId: { type: 'string' },
        roleId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = PlaceRole;
