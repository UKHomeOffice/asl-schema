const { Model } = require('objection');

class Profile extends Model {
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
      .then(roles => roles.map(r => r.type))
  }

  static count(establishmentId) {
    return this.query()
      .joinRelation('establishments')
      .where('establishments.id', establishmentId)
      .count()
      .then(result => result[0].count);
  }

  static search({ establishmentId, search, roles, pilh, pplh }) {

    if (roles === '') {
      roles = undefined;
    }

    const query = this.query()
      .skipUndefined()
      .joinRelation('establishments')
      .where('establishments.id', establishmentId)
      .distinct('profiles.*')
      .leftJoinRelation('pil')
      .leftJoinRelation('projects')
      .leftJoinRelation('roles')
      .andWhere('roles.type', roles)

    if (search) {
      query
        .where('pil.licenceNumber', 'iLike', search && `%${search}%`)
        .orWhere(function() {
          const parts = search.split(' ');
          if (parts.length > 1) {
            this
              .where('firstName', 'iLike', `%${parts[0]}`)
              .andWhere('lastName', 'iLike', `${parts[1]}%`)
          } else {
            this
              .where('firstName', 'iLike', `%${search}%`)
              .orWhere('lastName', 'iLike', `%${search}%`)
          }
        })
    }

    if (pilh) {
      query.whereNot('pil.id', null)
    }

    if (pplh) {
      query.whereNot('projects.id', null)
    }

    return query;
  }

  static get relationMappings() {
    return {
      roles: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'profiles.id',
          to: 'roles.profileId'
        }
      },
      trainingModules: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/training-module`,
        join: {
          from: 'profiles.id',
          to: 'trainingModules.profileId'
        }
      },
      establishments: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'profiles.id',
          through: {
            from: 'permissions.profileId',
            to: 'permissions.establishmentId'
          },
          to: 'establishments.id'
        }
      },
      pil: {
        relation: Model.HasOneRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'profiles.id',
          to: 'pils.profileId'
        }
      },
      projects: {
        relation: Model.HasManyRelation,
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
