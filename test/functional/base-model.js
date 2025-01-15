const moment = require('moment');
const assert = require('assert');
const knex = require('knex');
const {test} = require('../../knexfile.js');
const dbHelper = require('./helpers/db.js');
const BaseModel = require('../../schema/base-model.js');

const settings = test;

let Model;

describe('Base Model', () => {
  before(() => {
    dbHelper.init();
    Model = class extends BaseModel {
      static get tableName() {
        return 'authorisations';
      }
    };
    Model = Model.bindKnex(knex(settings));
  });

  after(() => dbHelper.clean(BaseModel));

  beforeEach(async () => {
    await Model.queryWithDeleted().hardDelete();
    await Model.query(dbHelper.init().knex).insert([
      {
        id: '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2',
        type: 'killing',
        method: 'captive bolt',
        updatedAt: '2019-10-01T12:00:00.000Z'
      },
      {
        id: '561dfe21-fc2a-420f-8bb6-100b1f1e2735',
        type: 'rehomes',
        updatedAt: '2019-10-01T12:00:00.000Z'
      }
    ]);
  });

  describe('soft delete', () => {
    it('ignores soft deleted models using query()', async () => {
      await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete();
      const models = await Model.query(dbHelper.init().knex);
      assert.strictEqual(models.length, 1);
      assert.strictEqual(models[0].id, '561dfe21-fc2a-420f-8bb6-100b1f1e2735');
    });

    it('returns only deleted models on queryDeleted', async () => {
      await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete();
      const models = await Model.queryDeleted();
      assert.strictEqual(models.length, 1);
      assert.strictEqual(models[0].id, '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
    });

    it('returns all models including deleted on queryWithDeleted', async () => {
      await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete();
      const models = await Model.queryWithDeleted();
      assert.strictEqual(models.length, 2);
    });

    it('marks the entry with a deleted timestamp', async () => {
      await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete();
      const model = await Model.queryWithDeleted().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      assert(moment(model.deleted).isValid());
    });

    it('has an undelete method which restores the model', async () => {
      await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').delete();
      await Model.queryWithDeleted(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').undelete();
      const model = await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      assert.strictEqual(model.id, '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
    });

    it('has a hardDelete method which deletes the model', async () => {
      await Model.query().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2').hardDelete();
      const model = await Model.queryWithDeleted().findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      assert.strictEqual(model, undefined);
    });
  });

  describe('preserveUpdatedAt', () => {
    it('updates the `updatedAt` timestamp to now by default', async () => {
      await Model.query(dbHelper.init().knex).update({ type: 'rehomes' }).where({ id: '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2' });
      const model = await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      const updatedAtDate = new Date(model.updatedAt);
      const now = new Date();
      assert.strictEqual(updatedAtDate.toISOString().split('T')[0], now.toISOString().split('T')[0]);
    });

    it('preserves the `updatedAt` timestamp if `preserveUpdatedAt` context is set', async () => {
      await Model.query(dbHelper.init().knex).context({ preserveUpdatedAt: true }).update({ type: 'rehomes' }).where({ id: '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2' });
      const model = await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      const updatedAtString = model.updatedAt instanceof Date ? model.updatedAt.toISOString() : model.updatedAt;
      assert.strictEqual(updatedAtString.split('T')[0], '2019-10-01');
    });
  });

  describe('upsert', () => {
    it('updates a model if found by id', async () => {
      await Model.upsert({
        id: '6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2',
        type: 'rehomes'
      }, null, dbHelper.init().knex);
      const model = await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      assert.strictEqual(model.type, 'rehomes');
    });

    it('updates a model if found by where clause', async () => {
      await Model.upsert({ type: 'rehomes' }, { type: 'killing' }, dbHelper.init().knex);
      const model = await Model.query(dbHelper.init().knex).findById('6d9c921f-ac0d-401b-ace4-e4d55b4ea2d2');
      assert.strictEqual(model.type, 'rehomes');
    });

    it('inserts a model if no id or where clause provided', async () => {
      await Model.upsert({ type: 'rehomes' });
      const models = await Model.query();
      assert.strictEqual(models.length, 3);
    });

    it('inserts a model if no model found with where clause', async () => {
      await Model.upsert({ type: 'killing' }, { method: 'bazooka' }, dbHelper.init().knex);
      const models = await Model.query(dbHelper.init().knex);
      assert.strictEqual(models.length, 3);
    });
  });
});
