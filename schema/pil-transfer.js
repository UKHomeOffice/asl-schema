import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import Pil from './pil.js';
import Establishment from './establishment.js';

const {uuid} = regex;
class PilTransfer extends BaseModel {
  static get tableName() {
    return 'pilTransfers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['pilId', 'fromEstablishmentId', 'toEstablishmentId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        pilId: { type: 'string', pattern: uuid.v4 },
        fromEstablishmentId: { type: 'integer' },
        toEstablishmentId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      pil: {
        relation: this.BelongsToOneRelation,
        modelClass: Pil,
        join: {
          from: 'pilTransfers.pilId',
          to: 'pils.id'
        }
      },
      from: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'pilTransfers.fromEstablishmentId',
          to: 'establishments.id'
        }
      },
      to: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'pilTransfers.toEstablishmentId',
          to: 'establishments.id'
        }
      }
    };
  }
}

export default PilTransfer;
