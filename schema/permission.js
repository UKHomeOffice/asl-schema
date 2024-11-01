import {externalPermissions} from '@ukhomeoffice/asl-constants';
import BaseModel from './base-model.js';

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
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }
}

export default Permission;
