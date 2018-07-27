const { Model } = require('objection');

class Authorisation extends Model {
  static get tableName() {
    return 'authorisations';
  }
}

module.exports = Authorisation;
