const uuid = require('uuid/v4');
const moment = require('moment');
const assert = require('assert');
const { up } = require('../../migrations/20200824182434_migrate_pil_licence_no_to_profile');
const db = require('./helpers/db');

describe('up', () => {
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

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('establishments').insert(establishment))
      .then(() => this.knex('profiles').insert(profile))
      .then(() => this.knex('pils').insert(pils));
  });

  afterEach(() => {
    return db.clean(this.knex);
  });

  after(() => {
    return this.knex.destroy();
  });

  it('updates the pil_licence_number on the profile from the most recently issued pil', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('profiles').where({ id: ids.profile }).first())
      .then(profile => {
        assert.deepEqual(profile.pil_licence_number, LICENCE_NUMBER);
      });
  });
});
