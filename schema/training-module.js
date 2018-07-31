const BaseModel = require('./base-model');

class TrainingModule extends BaseModel {
  static get tableName() {
    return 'trainingModules';
  }
}

module.exports = TrainingModule;
