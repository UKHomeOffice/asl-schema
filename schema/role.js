const BaseModel = require('./base-model');

class Role extends BaseModel {
  static get tableName() {
    return 'roles';
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'roles.profileId',
          to: 'profiles.id'
        }
      },
      places: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/place`,
        join: {
          from: 'roles.id',
          to: 'places.nacwoId'
        }
      }
    };
  }

  getProfile() {
    return this.$relatedQuery('profile');
  }
}

module.exports = Role;
