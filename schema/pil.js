const BaseModel = require('./base-model');
const { pilStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

class PIL extends BaseModel {
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
        notesCatF: { type: ['string', 'null'] },
        billable: { type: 'boolean' }
      }
    };
  }

  static list({ establishmentId, sort = {}, limit, offset, filters }) {

    let query = this.query()
      .leftJoinRelation('profile')
      .where({ 'establishmentId': establishmentId })
      .whereNotNull('issueDate')
      .eager('profile');

    if (filters.onlyBillable) {
      query = query.whereNot({ billable: false });
    }

    if (filters && filters.startDate && filters.endDate) {
      query = query
        .where('issueDate', '<=', filters.endDate)
        .where(builder => {
          builder
            .whereNull('revocationDate')
            .orWhere(builder => {
              builder
                .where('revocationDate', '>', filters.startDate)
                .where('revocationDate', '<=', filters.endDate);
            });
        });
    }

    if (sort.column) {
      query = this.orderBy({ query, sort });
    }
    query.orderBy('profile.lastName');

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
