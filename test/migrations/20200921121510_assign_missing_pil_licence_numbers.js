import assert from 'assert';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {up} from '../../migrations/20200921121510_assign_missing_pil_licence_numbers.js';
import Knex from 'knex';
import dbExtra from '../functional/helpers/db.js';

describe('generateLicenceNumber', () => {
  // todo: get the config from helper method.
  const knexInstance = Knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'test-password',
      database: 'asl-test'
    }
  });

  const ids = {
    hasLicenceNumber: uuid(),
    missingLicenceNumber: uuid(),
    missingLicenceNumberNoPil: uuid(),
    hasInactivePil: uuid()
  };

  const establishment = {
    id: 100,
    name: 'An establishment',
    email: 'an@establishment.com',
    country: 'england',
    address: '123 Somwhere street'
  };

  const profiles = [
    {
      id: ids.hasLicenceNumber,
      first_name: 'Has',
      last_name: 'LicenceNumber',
      email: 'aaa@bbb.com',
      pil_licence_number: 'EXISTING'
    },
    {
      id: ids.missingLicenceNumber,
      first_name: 'Missing',
      last_name: 'LicenceNumber',
      email: 'bbb@aaa.com'
    },
    {
      id: ids.missingLicenceNumberNoPil,
      first_name: 'Missing',
      last_name: 'LicenceNumberNoPil',
      email: 'bbb@ccc.com'
    },
    {
      id: ids.hasInactivePil,
      first_name: 'Has',
      last_name: 'InactivePil',
      email: 'ccc@ddd.com'
    }
  ];

  const pils = [
    {
      status: 'active',
      establishment_id: 100,
      profile_id: ids.hasLicenceNumber,
      issue_date: moment().toISOString(),
      deleted: moment().toISOString()
    },
    {
      status: 'active',
      establishment_id: 100,
      profile_id: ids.missingLicenceNumber,
      issue_date: moment().toISOString()
    },
    {
      status: 'inactive',
      establishment_id: 100,
      profile_id: ids.hasInactivePil,
      issue_date: moment().toISOString()
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
      await knexInstance('profiles').insert(profiles);
      await knexInstance('pils').insert(pils);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  it('skips profiles that already have a pilLicenceNumber', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('profiles').where('id', ids.hasLicenceNumber).first())
      .then(profile => {
        assert.equal(profile.pil_licence_number, 'EXISTING');
      });
  });

  it('assigns a new pilLicenceNumber if missing, and has active pil', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('profiles').where('id', ids.missingLicenceNumber).first())
      .then(profile => {
        assert.ok(profile.pil_licence_number);
        assert.equal(profile.pil_licence_number.charAt(0), 'I');
      });
  });

  it('doesn\'t assign licence number to profile with no pil', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('profiles').where('id', ids.missingLicenceNumberNoPil).first())
      .then(profile => {
        assert.equal(profile.pil_licence_number, null);
      });
  });

  it('doesn\'t assign licence number to profile with inactive', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('profiles').where('id', ids.hasInactivePil).first())
      .then(profile => {
        assert.equal(profile.pil_licence_number, null);
      });
  });
});
