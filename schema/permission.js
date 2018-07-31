const BaseModel = require('./base-model');

class Permission extends BaseModel {
  static get tableName() {
    return 'permissions';
  }
}

module.exports = Permission;
