const BaseModel = require('./base-model');
const { externalPermissions } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

class Invitation extends BaseModel {
  static get tableName() {
    return 'invitations';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'establishmentId', 'email', 'token'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        token: { type: 'string' },
        role: { type: 'string', enum: externalPermissions },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        email: { type: 'string' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static getInvitations(props) {
    return Promise.all([
      this.count(props),
      this.paginate(props)
    ])
      .then(([total, invitations]) => ({ total, invitations }));
  }

  static count({ establishmentId }) {
    return this.query()
      .where({ establishmentId })
      .count()
      .then(results => results[0])
      .then(result => result.count);
  }

  static paginate({ establishmentId, sort = {}, limit, offset }) {
    let query = this.query().where({ establishmentId });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('createdAt');
    }

    query = super.paginate({ query, limit, offset });

    return query;
  }
}

module.exports = Invitation;
