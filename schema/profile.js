const { ref } = require('objection');
const { compact, remove } = require('lodash');
const BaseModel = require('./base-model');
const Role = require('./role');
const Permission = require('./permission');
const { date, uuid } = require('../lib/regex-validation');

class Profile extends BaseModel {
  static get tableName() {
    return 'profiles';
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
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
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
      .withGraphFetched('[roles.places, establishments, pil(getLicenceNumber).establishment, projects, certificates, exemptions, asru, trainingPils.trainingCourse.[establishment, project]]')
      .modifiers({
        getLicenceNumber: builder => {
          builder.select([
            'pils.*',
            'profile.pilLicenceNumber as licenceNumber'
          ]).joinRelation('profile');
        }
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
      .then(result => result[0])
      .then(result => parseInt(result.count, 10));
  }

  static searchFullName({ query, search, prefix }) {
    const parts = search.split(' ');
    let firstName = 'firstName';
    let lastName = 'lastName';
    if (prefix) {
      firstName = `${prefix}.${firstName}`;
      lastName = `${prefix}.${lastName}`;
    }
    if (parts.length > 1) {
      query
        .where(firstName, 'iLike', `${parts[0]}%`)
        .andWhere(lastName, 'iLike', `${parts[1]}%`);
    } else {
      query
        .where(firstName, 'iLike', `%${search}%`)
        .orWhere(lastName, 'iLike', `%${search}%`);
    }
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
      .leftJoinRelation('[pil, projects, roles]')
      .withGraphFetched('[pil, projects, establishments, roles, trainingPils]')
      .where(builder => {
        if (search) {
          return builder
            .where('pilLicenceNumber', 'iLike', search && `%${search}%`)
            .orWhere(builder => this.searchFullName({ search, query: builder }));
        }
      });

    if (filters.roles && filters.roles.length) {
      const roles = compact(filters.roles);

      // filter on pseudo roles
      const customRoles = remove(roles, role => ['pplh', 'pilh', 'admin'].includes(role));

      if (roles.length) {
        query.whereIn('roles.type', roles);
      }

      if (customRoles.includes('pilh')) {
        query.whereNot('pil.id', null)
          .where('pil.status', 'active');
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

  static getNamedProfiles({ userId, establishmentId, ...params }) {
    const namedPeople = () => {
      return this.query()
        .where(builder => {
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
    };

    return Promise.all([
      this.getFilterOptions({ query: namedPeople(), establishmentId, ...params }),
      this.count({ query: namedPeople(), establishmentId, ...params }),
      this.searchAndFilter({ query: namedPeople(), establishmentId, ...params })
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
      projects: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'profiles.id',
          to: 'projects.licenceHolderId'
        },
        filter: f => {
          return f.skipUndefined().where('establishmentId', f.context().establishmentId);
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
      }
    };
  }
}

module.exports = Profile;
