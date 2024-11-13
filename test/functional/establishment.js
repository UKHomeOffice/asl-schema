import assert from 'assert';
import dbExtra from './helpers/db.js';
import BaseModel from '../../schema/base-model.js';
import Knex from 'knex';
import Establishment from '../../schema/establishment.js';

const validEstablishment = {
  id: 8201,
  name: 'University of life',
  email: 'info@university.of.life',
  country: 'england',
  address: '123 Somwhere Street'
};

const { knexInstance: dbInstance } = dbExtra;

const knexInstance = Knex({
  ...dbInstance.client.config
});

describe('Establishment model', () => {
  let model = null;

  before(async () => {
    model = await dbExtra.init();
    BaseModel.knex(knexInstance);
  });

  beforeEach(async () => {
    await dbExtra.clean(model);
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  describe('Validation', () => {
    it('throws an error if validation fails', () => {
      return assert.rejects(() => Establishment.query().insert({ id: 8201 }), {
        name: 'ValidationError'
      });
    });

    it('doesn\'t throw if establishment is valid', () => {
      return assert.doesNotReject(() => {
        return Establishment.query().insert(validEstablishment);
      });
    });

  });

});
