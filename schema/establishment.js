const BaseModel = require('./base-model');
const { establishmentStatuses, establishmentCountries } = require('@asl/constants');

class Establishment extends BaseModel {
  static get tableName() {
    return 'establishments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'name'],
      additionalProperties: false,
      properties: {
        id: { type: 'integer' },
        migratedId: { type: ['string', 'null'] },
        name: { type: 'string' },
        type: { type: ['string', 'null'] },
        status: { type: 'string', enum: establishmentStatuses },
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        country: { type: 'string', enum: establishmentCountries },
        address: { type: 'string' },
        email: { type: 'string', format: 'email' },
        procedure: { type: 'boolean' },
        breeding: { type: 'boolean' },
        supplying: { type: 'boolean' },
        killing: { type: 'boolean' },
        rehomes: { type: 'boolean' },
        conditions: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
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

  static count() {
    return this.query()
      .count()
      .then(results => results[0])
      .then(result => result.count);
  }

  getPELH() {
    return this.$relatedQuery('roles')
      .where('type', 'pelh')
      .then(roles => roles[0])
      .then(role => role && role.getProfile());
  }
}

module.exports = Establishment;
