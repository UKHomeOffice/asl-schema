const BaseModel = require('./base-model');

class Establishment extends BaseModel {
  static get tableName() {
    return 'establishments';
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

  getPELH() {
    return this.$relatedQuery('roles')
      .where('type', 'pelh')
      .then(roles => {
        return roles[0] && roles[0].getProfile();
      });
  }
}

module.exports = Establishment;
