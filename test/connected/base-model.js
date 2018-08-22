const assert = require('assert');
const db = require('./helpers/db');
const BaseModel = require('../../schema/base-model');

describe('Base Model', () => {
  it('Has a custom QueryBuilder', () => {
    assert.equal(BaseModel.QueryBuilder.name, 'SoftDeleteQueryBuilder');
  });

  describe('Custom methods', () => {
    before(() => {
      class Model extends BaseModel {
        static get tableName() {
          return 'authorisations';
        }
      }
      this.Model = Model;
      this.db = db.init();
    });

    beforeEach(() => {
      return Promise.resolve()
        .then(() => this.Model.queryWithDeleted().hardDelete())
        .then(() => {
          return this.Model.query().insert([
            {
              id: '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2',
              type: 'killing'
            },
            {
              id: '561dfe21-fc2a-420f-8bb6-100b1f1e2735',
              type: 'rehomes'
            }
          ]);
        });
    });

    after(() => {
      return this.db.destroy();
    });

    describe('soft delete', () => {
      it('ignores soft deleted models using query()', () => {
        return Promise.resolve()
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete())
          .then(() => this.Model.query())
          .then(models => {
            assert.deepEqual(models.length, 1);
            assert.deepEqual(models[0].id, '561dfe21-fc2a-420f-8bb6-100b1f1e2735');
          });
      });

      it('returns only deleted models on queryDeleted', () => {
        return Promise.resolve()
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete())
          .then(() => this.Model.queryDeleted())
          .then(models => {
            assert.deepEqual(models.length, 1);
            assert.deepEqual(models[0].id, '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
          });
      });

      it('returns all models including deleted on queryWithDeleted', () => {
        return Promise.resolve()
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete())
          .then(() => this.Model.queryWithDeleted())
          .then(models => {
            assert.deepEqual(models.length, 2);
          });
      });

      it('marks the entry with a deleted timestamp', () => {
        return Promise.resolve()
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete())
          .then(() => this.Model.queryWithDeleted().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2'))
          .then(model => {
            assert(model.deleted instanceof Date);
          });
      });

      it('has an undelete method which resores the model', () => {
        return Promise.resolve()
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete())
          .then(() => this.Model.queryWithDeleted().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').undelete())
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2'))
          .then(model => {
            assert(model.id, '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
          });
      });

      it('has a hardDelete method which deletes the model', () => {
        return Promise.resolve()
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').hardDelete())
          .then(() => this.Model.queryWithDeleted().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2'))
          .then(model => {
            assert.deepEqual(model, undefined);
          });
      });
    });

    describe('upsert', () => {
      it('updates a model if found by id', () => {
        return Promise.resolve()
          .then(() => this.Model.query().upsert({
            id: '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2',
            type: 'rehomes'
          }))
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2'))
          .then(model => {
            assert.deepEqual(model.type, 'rehomes');
          });
      });

      it('updates a model if found by where clause', () => {
        return Promise.resolve()
          .then(() => this.Model.query().upsert({
            type: 'rehomes'
          }, {
            type: 'killing'
          }))
          .then(() => this.Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2'))
          .then(model => {
            assert.deepEqual(model.type, 'rehomes');
          });
      });

      it('inserts a model if no id or where clause provided', () => {
        return Promise.resolve()
          .then(() => this.Model.query().upsert({ type: 'rehomes' }))
          .then(() => this.Model.query())
          .then(models => {
            assert.deepEqual(models.length, 3);
          });
      });
    });
  });
});
