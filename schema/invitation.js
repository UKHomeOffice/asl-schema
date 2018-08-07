const BaseModel = require('./base-model');

class Invitation extends BaseModel {
  static get tableName() {
    return 'invitations';
  }
}

module.exports = Invitation;
