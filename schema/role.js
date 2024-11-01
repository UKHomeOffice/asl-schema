import {roles} from '@ukhomeoffice/asl-constants';
import BaseModel from './base-model.js';
import Establishment from './establishment.js';
import Profile from './profile.js';
import Place from './place.js';

class Role extends BaseModel {
  static get tableName() {
    return 'roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type', 'establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        migratedId: { type: ['string', 'null'] },
        type: {
          type: 'string',
          enum: roles
        },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'roles.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'roles.profileId',
          to: 'profiles.id'
        }
      },
      places: {
        relation: this.ManyToManyRelation,
        modelClass: Place,
        join: {
          from: 'roles.id',
          through: {
            from: 'placeRoles.roleId',
            to: 'placeRoles.placeId'
          },
          to: 'places.id'
        }
      }
    };
  }

  getProfile() {
    return this.$relatedQuery('profile');
  }
}

export default Role;
