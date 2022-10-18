const { ref } = require('objection');
const { compact, remove } = require('lodash');
const BaseModel = require('./base-model');
const Changelog = require('./changelog');
const TrainingPil = require('./training-pil');
const Role = require('./role');
const Permission = require('./permission');
const { date, uuid } = require('../lib/regex-validation');

const QueryBuilder = require('./query-builder');

class ProfileQueryBuilder extends QueryBuilder {

  whereNotWaived() {
    const { establishmentId, year } = this.context();
    if (!establishmentId || !year) {
      throw new Error('whereNotWaived requires a establishmentId and start date to be set in query context');
    }
    return this
      .whereNotExists(
        Profile.relatedQuery('feeWaivers').where({ establishmentId, year })
      );
  }

  whereHasBillablePIL({ establishmentId, start, end }) {
    const year = parseInt(start.substr(0, 4), 10);
    this.context({ establishmentId, start, end, year });
    return this
      .where(builder => {
        builder
          .whereExists(
            Profile.relatedQuery('pil')
              .whereBillable({ establishmentId, start, end })
          )
          .orWhereExists(
            Profile
              .relatedQuery('trainingPils')
              .joinRelation('trainingCourse')
              .where('trainingCourse.establishmentId', establishmentId)
              .where('issueDate', '<', end)
              .where(builder => {
                builder
                  .where('revocationDate', '>', start)
                  .orWhere(builder => {
                    builder
                      .whereNull('revocationDate')
                      .where('expiryDate', '>', start);
                  });
              })
          );
      });
  }

}

class Profile extends BaseModel {
  static get tableName() {
    return 'profiles';
  }

  static get QueryBuilder() {
    return ProfileQueryBuilder.mixin(QueryBuilder.NameSearch);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migratedId: { type: ['string', 'null'] },
        userId: { type: ['string', 'null'] },
        title: { type: ['string', 'null'] },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        dob: { type: ['string', 'null'], pattern: date.yearMonthDay },
        position: { type: ['string', 'null'] },
        qualifications: { type: ['string', 'null'] },
        certifications: { type: ['string', 'null'] },
        pilLicenceNumber: { type: ['string', 'null'] },
        rcvsNumber: { type: ['string', 'null'] },
        address: { type: ['string', 'null'] },
        postcode: { type: ['string', 'null'] },
        telephone: { type: ['string', 'null'] },
        telephoneAlt: { type: ['string', 'null'] },
        notes: { type: ['string', 'null'] },
        asruUser: { type: 'boolean' },
        asruAdmin: { type: 'boolean' },
        asruLicensing: { type: 'boolean' },
        asruInspector: { type: 'boolean' },
        asruSupport: { type: 'boolean' },
        asruRops: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' },
        emailConfirmed: { type: 'boolean' },
        lastLogin: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  $beforeUpdate() {
    // strip all ASRU roles if the user is no-longer part of ASRU
    if (this.asruUser === false) {
      this.asruAdmin = false;
      this.asruLicensing = false;
      this.asruInspector = false;
      this.asruSupport = false;
      this.asruRops = false;
    }
  }

  static scopeToParams(params) {
    return {
      getAll: () => this.getProfiles(params),
      getNamed: () => this.getNamedProfiles(params)
    };
  }

  static scopeSingle(params) {
    return {
      get: () => this.get(params),
      getNamed: () => this.getNamed(params)
    };
  }

  static get({ query, id, establishmentId }) {
    query = query || this.query();
    query
      .findById(id)
      .skipUndefined();

    if (establishmentId) {
      query.scopeToEstablishment('establishments.id', establishmentId);
    }
    return query
      .withGraphFetched(`[
        roles.places,
        establishments,
        pil(getLicenceNumber).establishment,
        projects.[establishment(constrainEstParams), additionalEstablishments(getEstablishment)],
        certificates,
        exemptions,
        asru,
        trainingPils.trainingCourse.[establishment, project]
      ]`)
      .modifiers({
        getEstablishment: builder => {
          builder.select([
            'establishments.id',
            'establishments.name',
            'projectEstablishments.status'
          ]);
          if (establishmentId) {
            builder.where({ 'establishments.id': establishmentId });
          }
        },
        getLicenceNumber: builder => {
          builder.select([
            'pils.*',
            'profile.pilLicenceNumber as licenceNumber'
          ]).joinRelation('profile');
        },
        constrainEstParams: builder => builder.select('id', 'name')
      });
  }

  static getNamed({ userId, establishmentId, ...params }) {
    const query = this.query().where(builder => {
      const role = Role.query()
        .select(1)
        .where({ establishmentId })
        .where('profiles.id', ref('roles.profileId'));

      const admin = Permission.query()
        .select(1)
        .where({ establishmentId, role: 'admin' })
        .where('profiles.id', ref('permissions.profileId'));

      return builder
        .whereExists(role)
        .orWhereExists(admin)
        .orWhere('profiles.id', userId);
    });
    return this.get({ query, establishmentId, ...params });
  }

  static get virtualAttributes() {
    return ['name'];
  }

  name() {
    return `${this.firstName} ${this.lastName}`;
  }

  static getFilterOptions({ query, establishmentId }) {
    query = query || this.query();

    return query
      .scopeToEstablishment('establishments.id', establishmentId)
      .joinRelation('roles')
      .distinct('roles.type')
      .then(roles => roles.map(r => r.type));
  }

  static count({ query, establishmentId }) {
    query = query || this.query();

    return query
      .scopeToEstablishment('establishments.id', establishmentId)
      .countDistinct('profiles.id')
      .then(result => result[0].count);
  }

  static searchAndFilter({
    query,
    establishmentId,
    search,
    filters = {},
    limit,
    offset,
    sort = {}
  }) {
    query = query || this.query();

    const role = filters.roles && filters.roles.includes('admin') ? 'admin' : null;

    query
      .distinct('profiles.*')
      .scopeToEstablishment('establishments.id', establishmentId, role)
      .leftJoinRelation('[pil, projects, roles, trainingPils]')
      .withGraphFetched('[pil.establishment(constrainEstParams), projects, establishments, roles, trainingPils]')
      .where(builder => {
        if (search) {
          return builder
            .where('pilLicenceNumber', 'iLike', search && `%${search}%`)
            .orWhere(builder => builder.whereNameMatch(search));
        }
      })
      .modifiers({
        constrainEstParams: builder => builder.select('id', 'name')
      });

    if (filters.roles && filters.roles.length) {
      const roles = compact(filters.roles);

      // filter on pseudo roles
      const customRoles = remove(roles, role => ['pplh', 'pilh', 'admin'].includes(role));

      if (roles.length) {
        query.whereIn('roles.type', roles);
      }

      if (customRoles.includes('pilh')) {
        query
          .where(builder => {
            builder
              .where(b => {
                b
                  .whereNot('pil.id', null)
                  .where('pil.status', 'active');
              })
              .orWhereExists(
                TrainingPil.query()
                  .leftJoinRelated('trainingCourse')
                  .where({ status: 'active', 'trainingCourse.establishmentId': establishmentId })
                  .where('profiles.id', ref('trainingPils.profileId'))
              );
          });

      }
      if (customRoles.includes('pplh')) {
        query.whereNot('projects.id', null)
          .where('projects.status', 'active');
      }
    }

    query = this.paginate({ query, limit, offset });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('lastName');
    }

    return query;
  }

  static getProfiles(params) {
    return Promise.all([
      this.getFilterOptions(params),
      this.count(params),
      this.searchAndFilter(params)
    ])
      .then(([filters, total, profiles]) => ({ filters, total, profiles }));
  }

  static getNamedProfiles({ userId, establishmentId, includeSelf = true, ...params }) {
    const namedPeople = () => {
      return this.query()
        .where(builder => {
          const role = Role.query()
            .select(1)
            .where({ establishmentId })
            .where('profiles.id', ref('roles.profileId'));

          builder.whereExists(role);

          if (includeSelf) {
            builder.orWhere('profiles.id', userId);
          }

          return builder;
        });
    };

    return Promise.all([
      this.getFilterOptions({ query: namedPeople(), establishmentId, ...params }),
      this.count({ query: namedPeople(), establishmentId, ...params }),
      this.searchAndFilter({ query: namedPeople(), establishmentId, ...params })
    ])
      .then(([filters, total, profiles]) => ({ filters, total, profiles }));
  }

  static searchAndFilterAsru({ query, search, filters = {}, limit, offset, sort = {} }) {
    query = query || this.query();

    query
      .distinct('profiles.*')
      .where('asruUser', true)
      .where(builder => {
        if (search) {
          return builder
            .where('email', 'iLike', search && `%${search}%`)
            .orWhere(builder => builder.whereNameMatch(search));
        }
      });

    if (filters.asruRoles && filters.asruRoles.length) {
      if (filters.asruRoles.includes('inspector')) {
        query.where('profiles.asruInspector', true);
      }
      if (filters.asruRoles.includes('licensing')) {
        query.where('profiles.asruLicensing', true);
      }
      if (filters.asruRoles.includes('support')) {
        query.where('profiles.asruSupport', true);
      }
      if (filters.asruRoles.includes('admin')) {
        query.where('profiles.asruAdmin', true);
      }
      if (filters.asruRoles.includes('rops')) {
        query.where('profiles.asruRops', true);
      }
    }

    query = this.paginate({ query, limit, offset });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('lastName');
    }

    return query;
  }

  static getAsruProfiles(params) {
    const filters = ['admin', 'support', 'rops', 'licensing', 'inspector'];

    const countAsruProfiles = this.query()
      .countDistinct('profiles.id')
      .where('asruUser', true)
      .then(result => result[0].count);

    return Promise.all([
      Promise.resolve(filters),
      countAsruProfiles,
      this.searchAndFilterAsru(params)
    ])
      .then(([filters, total, profiles]) => ({ filters, total, profiles }));
  }

  static getFormerAsruProfiles(params) {
    const { search, limit, offset, sort = {} } = params;

    const asruUserAdded = Changelog.query()
      .select('modelId')
      .where({ modelType: 'profile', action: 'update' })
      .whereJsonSupersetOf('state', { asruUser: true });

    const asruUserRemoved = Changelog.query()
      .select(this.raw('uuid(model_id) AS id'))
      .select('updatedAt AS removedAt')
      .whereJsonSupersetOf('state', { asruUser: false })
      .whereIn('modelId', asruUserAdded)
      .as('asruRemoved');

    const query = this.query().innerJoin(asruUserRemoved, 'profiles.id', 'asruRemoved.id');
    const countQuery = query.clone().count();

    let profilesQuery = query.select('profiles.*', 'asruRemoved.removedAt');

    if (search) {
      profilesQuery.where('email', 'iLike', search && `%${search}%`)
        .orWhere(builder => builder.whereNameMatch(search));
    }

    if (sort.column) {
      profilesQuery = this.orderBy({ query: profilesQuery, sort });
    } else {
      profilesQuery.orderBy('lastName');
    }

    profilesQuery = this.paginate({ query: profilesQuery, limit, offset });

    return Promise.all([
      Promise.resolve({}),
      countQuery.then(results => results[0].count),
      profilesQuery
    ])
      .then(([filters, total, profiles]) => ({ filters, total, profiles }));
  }

  static get relationMappings() {
    return {
      roles: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'profiles.id',
          to: 'roles.profileId'
        },
        filter: f => f.skipUndefined().where('establishmentId', f.context().establishmentId)
      },
      places: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/place`,
        join: {
          from: 'profiles.id',
          through: {
            modelClass: `${__dirname}/role`,
            from: 'roles.profileId',
            to: 'roles.id'
          },
          to: 'places.nacwoId'
        }
      },
      certificates: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/certificate`,
        join: {
          from: 'profiles.id',
          to: 'certificates.profileId'
        }
      },
      exemptions: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/exemption`,
        join: {
          from: 'profiles.id',
          to: 'exemptions.profileId'
        }
      },
      establishments: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'profiles.id',
          through: {
            from: 'permissions.profileId',
            to: 'permissions.establishmentId',
            extra: ['role']
          },
          to: 'establishments.id'
        },
        filter: f => f.skipUndefined().where('establishments.id', f.context().establishmentId)
      },
      invitations: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'profiles.id',
          through: {
            from: 'invitations.profileId',
            to: 'invitations.establishmentId',
            extra: ['token', 'role']
          },
          to: 'establishments.id'
        },
        filter: f => f.skipUndefined().where('establishments.id', f.context().establishmentId)
      },
      pil: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'profiles.id',
          to: 'pils.profileId'
        },
        filter: f => {
          return f.orderBy('issueDate', 'desc');
        }
      },
      trainingPils: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/training-pil`,
        join: {
          from: 'profiles.id',
          to: 'trainingPils.profileId'
        }
      },
      feeWaivers: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/fee-waiver`,
        join: {
          from: 'profiles.id',
          to: 'pilFeeWaivers.profileId'
        }
      },
      projects: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'profiles.id',
          to: 'projects.licenceHolderId'
        },
        filter: f => {
          if (!f.context().establishmentId) {
            return;
          }
          return f.whereHasAvailability(f.context().establishmentId);
        }
      },
      asru: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'profiles.id',
          through: {
            from: 'asruEstablishment.profileId',
            to: 'asruEstablishment.establishmentId'
          },
          to: 'establishments.id'
        }
      },
      emailPreferences: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/email-preferences`,
        join: {
          from: 'profiles.id',
          to: 'emailPreferences.profileId'
        }
      },
      notifications: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/notification`,
        join: {
          from: 'profiles.id',
          to: 'notifications.profileId'
        }
      }
    };
  }
}

module.exports = Profile;
