const BaseModel = require('./base-model');
const { pilStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');
const Profile = require('./profile');

class PILQueryBuilder extends BaseModel.QueryBuilder {

  whereNotWaived() {
    const { establishmentId, year } = this.context();
    if (!establishmentId || !year) {
      throw new Error('whereNotWaived requires a establishmentId and start date to be set in query context');
    }
    return this
      .whereNotExists(
        PIL.relatedQuery('feeWaivers').where({ establishmentId, year })
      );
  }

  whereBillable({ establishmentId, start, end }) {
    const year = parseInt(start.substr(0, 4), 10);
    this.context({ establishmentId, start, end, year });
    return this
      .where(builder => {
        // PIL was active during billing period
        builder
          .where('issueDate', '<=', end)
          .whereNotNull('issueDate')
          .where(builder => {
            builder
              .where('status', 'active')
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
              // filter out PILs that have never been transferred before doing expensive operations
              // this speeds up execution of the query by ~80-90%
              .whereExists(
                PIL.relatedQuery('pilTransfers').where('createdAt', '>', end)
              )
              .andWhere(
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

  billable({ establishmentId, start, end }) {
    const year = parseInt(start.substr(0, 4), 10);
    this.context({ establishmentId, year });
    return this
      .select([
        'pils.*',
        'profile.pilLicenceNumber as licenceNumber',
        PIL.relatedQuery('feeWaivers')
          .where({ establishmentId, year })
          .select(1)
          .as('waived')
      ])
      .eager('[profile.establishments, pilTransfers, feeWaivers]')
      .modifyEager('profile.establishments', builder => {
        builder.where('id', establishmentId);
      })
      .modifyEager('pilTransfers', builder => {
        builder
          .where('fromEstablishmentId', establishmentId)
          .orWhere('toEstablishmentId', establishmentId);
      })
      .modifyEager('feeWaivers', builder => {
        builder
          .where('establishmentId', establishmentId);
      })
      .leftJoinRelation('profile')
      .whereBillable({ establishmentId, start, end });
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

  static count(establishmentId) {
    const query = this.query().where({ status: 'active', establishmentId });
    return super.count(establishmentId, query);
  }

  static filter({ establishmentId, search, sort = {}, limit, offset }) {

    let query = this.query()
      .distinct(
        'pils.*',
        'profile.lastName',
        'profile.pilLicenceNumber as licenceNumber'
      )
      .leftJoinRelation('profile')
      .where({ 'pils.establishmentId': establishmentId })
      .eager('profile')
      .where({ status: 'active' })
      .where(builder => {
        if (search) {
          return builder
            .orWhere('licenceNumber', 'iLike', `%${search}%`)
            .orWhere(b => {
              Profile.searchFullName({
                search,
                prefix: 'profile',
                query: b
              });
            });
        }
      });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    }
    query.orderBy('reviewDate')
      .orderBy('profile.lastName');

    query = this.paginate({ query, limit, offset });

    return query;
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
      feeWaivers: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/fee-waiver`,
        join: {
          from: 'pils.id',
          to: 'feeWaivers.pilId'
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
