const BaseModel = require('./base-model');

class Authorisation extends BaseModel {
  static get tableName() {
    return 'authorisations';
  }
}

module.exports = Authorisation;
