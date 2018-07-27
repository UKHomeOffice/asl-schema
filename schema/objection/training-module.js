const { Model } = require('objection');

class TrainingModule extends Model {
  static get tableName() {
    return 'trainingModules';
  }
}

module.exports = TrainingModule;
