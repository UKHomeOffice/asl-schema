const moment = require('moment');
const uuid = require('uuid/v4');
const assert = require('assert');
const db = require('./helpers/db');
const { up } = require('../../migrations/20200330130157_add_review_date_to_pils');

const ids = {
  reviewSet: uuid(),
  reviewNotSet: uuid(),
  noUpdatedAt: uuid()
}

function isSame(timestamp1, timestamp2) {
  return moment(timestamp1).isSame(moment(timestamp2));
}

describe('Add review date migration', () => {

  const profiles = [
    {
      id: uuid(),
      first_name: 'Licence',
      last_name: 'Holder1',
      email: 'test1@example.com'
    },
    {
      id: uuid(),
      first_name: 'Licence',
      last_name: 'Holder2',
      email: 'test2@example.com'
    }
  ];

  const establishment = {
    id: 100,
    name: 'An establishment',
    email: 'an@establishment.com',
    country: 'england',
    address: '123 Somwhere street',
  };

  const pils = [
    {
      id: ids.reviewSet,
      establishment_id: establishment.id,
      profile_id: profiles[0].id,
      review_date: '2022-01-01T12:00:00.000Z',
      created_at: '2019-01-01T12:00:00.000Z',
      updated_at: '2019-01-01T12:00:00.000Z'
    },
    {
      id: ids.reviewNotSet,
      establishment_id: establishment.id,
      profile_id: profiles[1].id,
      created_at: '2019-01-01T12:00:00.000Z',
      updated_at: '2019-01-01T12:00:00.000Z'
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

  it('sets the review date where it is missing', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('pils'))
      .then(results => {
        const expected = moment(pils[1].updated_at).add(5, 'years').toISOString();
        assert.ok(
          isSame(
            results.find(p => p.id === ids.reviewSet).review_date,
            pils[0].review_date
          ),
          'It doesn\'t update the review_date if already set'
        );
        assert.ok(
          isSame(
            results.find(p => p.id === ids.reviewNotSet).review_date,
            expected
          ),
          'It sets the review_date as updated_at + 5 years if not set'
        );
      });
  });
});
