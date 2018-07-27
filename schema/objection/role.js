const { Model } = require('objection');

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get relationMappings() {
    return {
      profile: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'roles.profileId',
          to: 'profiles.id'
        }
      },
      places: {
        relation: Model.HasManyRelation,
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
