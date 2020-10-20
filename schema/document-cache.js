const moment = require('moment');
const { Model } = require('objection');

class DocumentCache extends Model {

  static get tableName() {
    return 'document_cache';
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static load(id, fn, { timeout = 2000, ttl = 60 } = {}) {
    return new Promise((resolve, reject) => {

      this.query().findById(id)
        .then(document => {
          if (document) {
            Object.defineProperty(document.document, 'cache', {
              enumerable: false,
              value: {
                cached: true,
                updatedAt: document.updatedAt
              }
            });
            if (ttl && moment(document.updatedAt).isAfter(moment().subtract(ttl, 'seconds'))) {
              return resolve(document.document);
            }

            setTimeout(() => {
              resolve(document.document);
            }, timeout);
          }

          return fn()
            .then(document => {
              return this.query().findById(id)
                .then(model => {
                  if (model) {
                    return model.$query().patch({ document }).returning('*');
                  }
                  return this.query().insert({ id, document }).returning('*');
                });
            })
            .then(document => {
              Object.defineProperty(document.document, 'cache', {
                enumerable: false,
                value: {
                  cached: false,
                  updatedAt: document.updatedAt
                }
              });
              resolve(document.document);
            });

        })
        .catch(reject);

    });

  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        document: { type: [ 'null', 'object', 'array' ] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }
}

module.exports = DocumentCache;
