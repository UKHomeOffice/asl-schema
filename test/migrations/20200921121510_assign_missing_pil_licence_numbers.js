const assert = require('assert');
const uuid = require('uuid/v4');
const moment = require('moment');
const { up } = require('../../migrations/20200921121510_assign_missing_pil_licence_numbers');
const db = require('./helpers/db');

describe('generateLicenceNumber', () => {
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

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('establishments').insert(establishment))
      .then(() => this.knex('profiles').insert(profiles))
      .then(() => this.knex('pils').insert(pils));
  });

  afterEach(() => {
    return db.clean(this.knex);
  });

  after(() => {
    return this.knex.destroy();
  });

  it('skips profiles that already have a pilLicenceNumber', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('profiles').where('id', ids.hasLicenceNumber).first())
      .then(profile => {
        assert.equal(profile.pil_licence_number, 'EXISTING');
      });
  });

  it('assigns a new pilLicenceNumber if missing, and has active pil', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('profiles').where('id', ids.missingLicenceNumber).first())
      .then(profile => {
        assert.ok(profile.pil_licence_number);
        assert.equal(profile.pil_licence_number.charAt(0), 'I');
      });
  });

  it('doesn\'t assign licence number to profile with no pil', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('profiles').where('id', ids.missingLicenceNumberNoPil).first())
      .then(profile => {
        assert.equal(profile.pil_licence_number, null);
      });
  });

  it('doesn\'t assign licence number to profile with inactive', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('profiles').where('id', ids.hasInactivePil).first())
      .then(profile => {
        assert.equal(profile.pil_licence_number, null);
      });
  });
});
