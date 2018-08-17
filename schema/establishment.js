const BaseModel = require('./base-model');
const { establishmentStatuses, establishmentCountries } = require('@asl/constants');

class Establishment extends BaseModel {
  static get tableName() {
    return 'establishments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'address', 'country', 'email'],
      additionalProperties: false,
      properties: {
        id: { type: ['string', 'null'] },
        'migrated_id': { type: ['string', 'null'] },
        name: { type: 'string' },
        type: { type: ['string', 'null'] },
        status: {
          type: ['string', 'null'],
          enum: establishmentStatuses
        },
        issueDate: { type: ['string', 'null'] },
        revocationDate: { type: ['string', 'null'] },
        licenceNumber: { type: ['string', 'null'] },
        country: {
          type: 'string',
          enum: establishmentCountries
        },
        address: { type: 'string' },
        email: { type: 'string' },
        procedure: { type: ['boolean', null] },
        breeding: { type: ['boolean', null] },
        supplying: { type: ['boolean', null] },
        killing: { type: ['boolean', null] },
        rehomes: { type: ['boolean', null] },
        conditions: { type: ['boolean', null] },
        'created_at': { type: ['string', 'null'] },
        'updated_at': { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      places: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/place`,
        join: {
          from: 'establishments.id',
          to: 'places.establishmentId'
        }
      },
      authorisations: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/authorisation`,
        join: {
          from: 'establishments.id',
          to: 'authorisations.establishmentId'
        }
      },
      roles: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'establishments.id',
          to: 'roles.establishmentId'
        }
      },
      profiles: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'establishments.id',
          through: {
            from: 'permissions.establishmentId',
            to: 'permissions.profileId',
            extra: ['role']
          },
          to: 'profiles.id'
        }
      },
      invitations: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'establishments.id',
          through: {
            from: 'invitations.establishmentId',
            to: 'invitations.profileId',
            extra: ['token', 'role']
          },
          to: 'profiles.id'
        }
      },
      pils: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'establishments.id',
          to: 'pils.establishmentId'
        }
      },
      projects: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'establishments.id',
          to: 'projects.establishmentId'
        }
      }
    };
  }

  getPELH() {
    return this.$relatedQuery('roles')
      .where('type', 'pelh')
      .then(roles => roles[0])
      .then(role => role && role.getProfile());
  }
}

module.exports = Establishment;
