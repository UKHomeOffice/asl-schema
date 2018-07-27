const { Model } = require('objection');

class Permission extends Model {
  static get tableName() {
    return 'permissions';
  }
}

module.exports = Permission;
