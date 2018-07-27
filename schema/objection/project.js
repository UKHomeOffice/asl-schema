const { Model } = require('objection');

class Project extends Model {
  static getTableName() {
    return 'projects';
  }

  static get relationMappings() {
    return {
      holder: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'projects.licenceHolderId',
          to: 'profiles.id'
        }
      },
      establishment: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'projects.establishmentId',
          to: 'establishments.id'
        }
      }
    };
  }
}

module.exports = Project;
