const { compact, remove } = require('lodash');
const BaseModel = require('./base-model');

class Profile extends BaseModel {
  static getTableName() {
    return 'profiles';
  }

  static get virtualAttributes() {
    return ['name'];
  }

  name() {
    return `${this.firstName} ${this.lastName}`;
  }

  static getFilterOptions(establishmentId) {
    return this.query()
      .joinRelation('roles')
      .distinct('roles.type')
      .then(roles => roles.map(r => r.type));
  }

  static count(establishmentId) {
    return this.query()
      .joinRelation('establishments')
      .where('establishments.id', establishmentId)
      .count()
      .then(result => result[0].count);
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
        .where(firstName, 'iLike', `%${parts[0]}`)
        .andWhere(lastName, 'iLike', `${parts[1]}%`);
    } else {
      query
        .where(firstName, 'iLike', `%${search}%`)
        .orWhere(lastName, 'iLike', `%${search}%`);
    }
  }

  static searchAndFilter({
    establishmentId,
    search,
    limit,
    offset,
    sort = {},
    filters = {}
  }) {
    let query = this.query()
      .distinct('profiles.*', 'roles.type', 'pil.licenceNumber')
      .joinRelation('establishments')
      .where('establishments.id', establishmentId)
      .leftJoinRelation('pil')
      .leftJoinRelation('projects')
      .leftJoinRelation('roles')
      .eager('[pil, roles, projects]');

    if (filters.roles && filters.roles.length) {
      const roles = compact(filters.roles);
      // filter on pseudo roles
      const customRoles = remove(roles, role => role === 'pilh' || role === 'pplh');

      if (roles.length) {
        query.whereIn('roles.type', roles);
      }

      if (customRoles.includes('pilh')) {
        query.whereNot('pil.id', null);
      }
      if (customRoles.includes('pplh')) {
        query.whereNot('projects.id', null);
      }
    }

    if (search) {
      query
        .where('pil.licenceNumber', 'iLike', search && `%${search}%`)
        .orWhere(builder => this.searchFullName({ search, query: builder }));
    }

    query = this.paginate({ query, limit, offset });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('lastName');
    }

    return query;
  }

  static get relationMappings() {
    return {
      roles: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'profiles.id',
          to: 'roles.profileId'
        }
      },
      trainingModules: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/training-module`,
        join: {
          from: 'profiles.id',
          to: 'trainingModules.profileId'
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
        }
      },
      pil: {
        relation: this.HasOneRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'profiles.id',
          to: 'pils.profileId'
        }
      },
      projects: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'profiles.id',
          to: 'projects.licenceHolderId'
        }
      }
    };
  }
}

module.exports = Profile;
