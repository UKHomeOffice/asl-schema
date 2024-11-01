import {externalPermissions} from '@ukhomeoffice/asl-constants';
import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import Establishment from './establishment.js';

const { uuid } = regex;

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
        token: { type: ['string', null] },
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
    return Promise.all([this.count(props), this.paginate(props)]).then(
      ([total, invitations]) => ({ total, invitations })
    );
  }

  static count({ establishmentId }) {
    return this.query()
      .where({ establishmentId })
      .count()
      .then((results) => results[0].count);
  }

  static paginate({ establishmentId, sort = {}, limit, offset }) {
    let query = this.query().where({ establishmentId });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('updatedAt');
    }

    query = super.paginate({ query, limit, offset });

    return query;
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'invitations.establishmentId',
          to: 'establishments.id'
        }
      }
    };
  }
}

export default Invitation;
