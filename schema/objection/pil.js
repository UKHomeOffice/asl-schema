const { Model } = require('objection');

class PIL extends Model {
  static get tableName() {
    return 'pils';
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'pils.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: Model.BelongsToOneRelation,
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
