const { QueryBuilder } = require('objection');
const BaseModel = require('./base-model');
const { pilStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

class PILQueryBuilder extends QueryBuilder {

  billable({ establishmentId, start, end }) {
    return this
      .select('pils.id', 'pils.licenceNumber', 'pils.establishmentId', 'pils.issueDate', 'pils.revocationDate')
      .eager('[profile.establishments, pilTransfers]')
      .leftJoinRelation('profile')
      .where(builder => {
        // PIL was active during billing period
        builder
          .where('issueDate', '<=', end)
          .whereNotNull('issueDate')
          .where(builder => {
            builder
              .whereNull('revocationDate')
              .orWhere('revocationDate', '>', start);
          });
      })
      .where(builder => {
        builder
          // PIL is currently held by establishment and has not been transferred in since end date
          .where(builder => {
            builder
              .where({ 'establishmentId': establishmentId })
              .whereNotExists(
                PIL.relatedQuery('pilTransfers')
                  .where('createdAt', '>', end)
              );
          })
          // PIL was transferred in or out of the establishment during the billing period
          .orWhere(builder => {
            builder
              .whereExists(
                PIL.relatedQuery('pilTransfers')
                  .where(builder => {
                    builder
                      .where('fromEstablishmentId', establishmentId)
                      .orWhere('toEstablishmentId', establishmentId);
                  })
                  .whereBetween('createdAt', [start, end])
              );
          })
          // the first PIL transfer after the end of the billing period was out of the establishment
          .orWhere(builder => {
            builder
              .where(
                establishmentId,
                PIL.relatedQuery('pilTransfers')
                  .select('fromEstablishmentId')
                  .where('createdAt', '>', end)
                  .orderBy('createdAt', 'asc')
                  .limit(1)
              );
          });
      });
  }

}

class PIL extends BaseModel {

  static get QueryBuilder() {
    return PILQueryBuilder;
  }

  static get tableName() {
    return 'pils';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migratedId: { type: ['string', 'null'] },
        status: { type: 'string', enum: pilStatuses },
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        reviewDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        conditions: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string', pattern: uuid.v4 },
        deleted: { type: ['string', 'null'], format: 'date-time' },
        procedures: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        species: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        notesCatD: { type: ['string', 'null'] },
        notesCatF: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'pils.establishmentId',
          to: 'establishments.id'
        }
      },
      pilTransfers: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/pil-transfer`,
        join: {
          from: 'pils.id',
          to: 'pilTransfers.pilId'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'pils.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = PIL;
