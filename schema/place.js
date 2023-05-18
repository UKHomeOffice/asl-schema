const { uniq, flatten } = require('lodash');
const BaseModel = require('./base-model');
const { suitabilityCodes, holdingCodes } = require('@ukhomeoffice/asl-constants');
const { uuid } = require('../lib/regex-validation');

class PlaceQueryBuilder extends BaseModel.QueryBuilder {
  joinRoles() {
    return this.leftJoinRelated('roles.profile')
      .withGraphFetched('roles(notDeleted).profile(constrainProfileParams)')
      .modifiers({
        notDeleted: (builder) =>
          builder.whereNull('placeRoles.deleted').whereNull('roles.deleted'),
        constrainProfileParams: (builder) =>
          builder.select('id', 'firstName', 'lastName')
      });
  }
}

class Place extends BaseModel {
  static get tableName() {
    return 'places';
  }

  static get QueryBuilder() {
    return PlaceQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['site', 'name', 'suitability', 'holding', 'establishmentId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migratedId: { type: ['string', 'null'] },
        site: { type: 'string' },
        area: { type: ['string', 'null'] },
        name: { type: 'string' },
        suitability: {
          type: 'array',
          items: {
            type: 'string',
            enum: suitabilityCodes
          }
        },
        holding: {
          type: 'array',
          items: {
            type: 'string',
            enum: holdingCodes
          }
        },
        restrictions: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        nacwoId: { type: ['string', 'null'] },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static getRoleFilters(types, key, establishmentId) {
    return this.query()
      .select('roles:profile.firstName', 'roles:profile.lastName')
      .distinct('roles.id')
      .rightJoinRelated('roles.profile')
      .where('roles.establishmentId', establishmentId)
      .whereIn('roles.type', types)
      .orderBy('roles:profile.lastName')
      .then((results) => {
        return {
          key,
          values: results.map((r) => {
            return {
              label: `${r.firstName} ${r.lastName}`,
              value: r.id
            };
          })
        };
      });
  }

  static getFilterOptions(establishmentId) {
    return Promise.all([
      ...['site', 'suitability', 'holding'].map((filter) =>
        this.query()
          .where({ establishmentId })
          .distinct(filter)
          .then((result) => {
            return {
              key: filter,
              values: uniq(flatten(result.map((r) => r[filter]))).sort()
            };
          })
      ),
      this.getRoleFilters(['nacwo'], 'nacwos', establishmentId),
      this.getRoleFilters(['nvs', 'sqp'], 'nvssqps', establishmentId)
    ]);
  }

  static filter({ establishmentId, filters = {}, sort = {}, limit, offset }) {
    let query = this.query()
      .select('places.*')
      .distinct('places.id')
      .where({ 'places.establishmentId': establishmentId })
      // we need to query the join table directly to avoid filtering on deleted associations
      .leftJoinRelation('roleJoins')
      .joinRoles();

    if (filters.site) {
      query.andWhere('site', 'in', filters.site);
    }

    if (filters.suitability) {
      query.whereJsonSupersetOf('suitability', filters.suitability);
    }

    if (filters.holding) {
      query.whereJsonSupersetOf('holding', filters.holding);
    }

    if (filters.nacwos) {
      query.whereExists(
        Place.relatedQuery('roleJoins').whereIn('roleId', filters.nacwos)
      );
    }

    if (filters.nvssqps) {
      query.whereExists(
        Place.relatedQuery('roleJoins').whereIn('roleId', filters.nvssqps)
      );
    }

    if (sort.column) {
      query = this.orderBy({ query, sort });
    }
    query.orderBy('site').orderBy('area').orderBy('name');

    query = this.paginate({ query, limit, offset });

    return query;
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'places.establishmentId',
          to: 'establishments.id'
        }
      },
      roleJoins: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/place-role`,
        join: {
          from: 'places.id',
          to: 'placeRoles.placeId'
        }
      },
      roles: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'places.id',
          through: {
            from: 'placeRoles.placeId',
            to: 'placeRoles.roleId'
          },
          to: 'roles.id'
        }
      }
    };
  }
}

module.exports = Place;
