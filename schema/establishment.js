const BaseModel = require('./base-model');
const {
  establishmentStatuses,
  establishmentCountries
} = require('@ukhomeoffice/asl-constants');

class Establishment extends BaseModel {
  static get tableName() {
    return 'establishments';
  }

  static get unlicensed() {
    return ['billing', 'cjsmEmail', 'sharedKey'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: {
        id: { type: 'integer' },
        migratedId: { type: ['string', 'null'] },
        name: { type: 'string' },
        keywords: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        type: { type: ['string', 'null'] },
        company: { type: ['string', 'null'] },
        status: { type: 'string', enum: establishmentStatuses },
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        suspendedDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        sharedKey: { type: ['string', 'null'] },
        country: { type: 'string', enum: establishmentCountries },
        address: { type: ['string', 'null'] },
        email: { type: ['string', 'null'], format: 'email' },
        cjsmEmail: { type: ['string', 'null'], format: 'email' },
        procedure: { type: 'boolean' },
        breeding: { type: 'boolean' },
        supplying: { type: 'boolean' },
        killing: { type: 'boolean' },
        rehomes: { type: 'boolean' },
        isTrainingEstablishment: { type: 'boolean' },
        billing: { type: ['object', 'null'] },
        conditions: { type: ['string', 'null'] },
        corporateStatus: { type: ['string', 'null'] },
        legalName: { type: ['string', 'null'] },
        legalPhone: { type: ['string', 'null'] },
        legalEmail: { type: ['string', 'null'] },
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
      transferredPils: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'establishments.id',
          through: {
            modelClass: `${__dirname}/pil-transfer`,
            from: 'pilTransfers.fromEstablishmentId',
            to: 'pilTransfers.pilId'
          },
          to: 'pils.id'
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
      },
      asru: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'establishments.id',
          through: {
            from: 'asruEstablishment.establishmentId',
            to: 'asruEstablishment.profileId'
          },
          to: 'profiles.id'
        }
      }
    };
  }

  static count() {
    return this.query()
      .countDistinct('establishments.id')
      .then((results) => results[0].count);
  }
}

module.exports = Establishment;
