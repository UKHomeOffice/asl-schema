import { v4 as uuid } from 'uuid';
import moment from 'moment';
import assert from 'assert';
import {up} from '../../migrations/20200824182434_migrate_pil_licence_no_to_profile.js';
import Knex from 'knex';
import dbExtra from '../functional/helpers/db.js';

describe('up', () => {
  // todo: get the config from helper method.
  const knexInstance = Knex({
    client: 'postgres',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'test-password',
      database: 'asl-test'
    }
  });

  const ids = {
    profile: uuid()
  };

  const establishment = {
    id: 100,
    name: 'An establishment',
    email: 'an@establishment.com',
    country: 'england',
    address: '123 Somwhere street'
  };

  const profile = {
    id: ids.profile,
    first_name: 'Holc',
    last_name: 'Hogan',
    email: 'holc@hogan.com'
  };

  const LICENCE_NUMBER = 'SN123456';

  const pils = [
    {
      status: 'active',
      establishment_id: 100,
      profile_id: ids.profile,
      licence_number: 'DELETED LICENCE',
      issue_date: moment().toISOString(),
      deleted: moment().toISOString()
    },
    {
      status: 'active',
      establishment_id: 100,
      profile_id: ids.profile,
      licence_number: LICENCE_NUMBER,
      issue_date: moment().subtract(1, 'month').toISOString()
    },
    {
      status: 'revoked',
      establishment_id: 100,
      profile_id: ids.profile,
      licence_number: 'REVOKED LICENCE',
      issue_date: moment().subtract(2, 'months').toISOString()
    },
    {
      status: 'active',
      establishment_id: 100,
      profile_id: ids.profile,
      licence_number: 'SUPERSEDED LICENCE',
      issue_date: moment().subtract(2, 'months').toISOString()
    }
  ];

  let model = null;

  before(async () => {
    model = await dbExtra.init();
  });

  beforeEach(async () => {
    await dbExtra.clean(model);
    try {
      await knexInstance('establishments').insert(establishment);
      await knexInstance('profiles').insert(profile);
      await knexInstance('pils').insert(pils);

      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  it('updates the pil_licence_number on the profile from the most recently issued pil', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('profiles').where({ id: ids.profile }).first())
      .then(profile => {
        assert.deepEqual(profile.pil_licence_number, LICENCE_NUMBER);
      });
  });
});
