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

describe('Add review date migration', () => {

  const pils = [
    {
      id: ids.reviewSet,
      establishment_id: 100,
      procedures: ['B', 'C'],
      review_date: '2022-01-01T12:00:00.000Z',
      created_at: '2019-01-01T12:00:00.000Z',
      updated_at: '2019-01-01T12:00:00.000Z'
    },
    {
      id: ids.reviewNotSet,
      establishment_id: 100,
      procedures: ['B', 'C'],
      created_at: '2019-01-01T12:00:00.000Z',
      updated_at: '2019-01-01T12:00:00.000Z'
    }
  ];

  const profiles = [
    {
      first_name: 'Licence',
      last_name: 'Holder1',
      email: 'test1@example.com',
      pil: pils[0]
    },
    {
      first_name: 'Licence',
      last_name: 'Holder2',
      email: 'test2@example.com',
      pil: pils[1]
    }
  ]

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.Establishment.query().insertGraph({
        id: 100,
        name: 'An establishment',
        email: 'an@establishment.com',
        country: 'england',
        address: '123 Somwhere street',
        profiles
      }));
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  it('sets the review date where it is missing', () => {
    return Promise.resolve()
      .then(() => up(this.models.knex))
      .then(() => this.models.PIL.query())
      .then(results => {
        const expected = moment(pils[1].updatedAt).add(5, 'years').toISOString();
        assert.equal(results.find(p => p.id === ids.reviewSet).reviewDate, pils[0].reviewDate, 'It doesn\'t update the reviewDate if already set');
        assert.equal(results.find(p => p.id === ids.reviewNotSet).reviewDate, expected, 'It sets the reviewDate as updatedAt + 5 years if not set');
      });
  });
});
