import moment from 'moment';
import { v4 as uuid } from 'uuid';
import assert from 'assert';
import Knex from 'knex';
import objection from 'objection';
import dbExtra from '../functional/helpers/db.js';
import BaseModel from '../../schema/base-model.js';
import Establishment from '../../schema/establishment.js';
import Profile from '../../schema/profile.js';
import Pil from '../../schema/pil.js';
import { up } from '../../migrations/20200330130157_add_review_date_to_pils.js';

const ids = {
  reviewSet: uuid(),
  reviewNotSet: uuid(),
  noUpdatedAt: uuid()
};

function isSame(timestamp1, timestamp2) {
  return moment(timestamp1).isSame(moment(timestamp2));
}
const { knexSnakeCaseMappers } = objection;

describe('Add review date migration', () => {
  const { knexInstance: dbInstance } = dbExtra;

  const knexInstance = Knex({
    ...dbInstance.client.config,
    ...knexSnakeCaseMappers()
  });

  const profiles = [
    {
      id: uuid(),
      firstName: 'Licence',
      lastName: 'Holder1',
      email: 'test1@example.com'
    },
    {
      id: uuid(),
      firstName: 'Licence',
      lastName: 'Holder2',
      email: 'test2@example.com'
    }
  ];

  const establishment = {
    id: 100,
    name: 'An establishment',
    email: 'an@establishment.com',
    country: 'england',
    address: '123 Somwhere street'
  };

  const pils = [
    {
      id: ids.reviewSet,
      establishmentId: establishment.id,
      profileId: profiles[0].id,
      reviewDate: '2022-01-01T12:00:00.000Z',
      createdAt: '2019-01-01T12:00:00.000Z',
      updatedAt: '2019-01-01T12:00:00.000Z'
    },
    {
      id: ids.reviewNotSet,
      establishmentId: establishment.id,
      profileId: profiles[1].id,
      createdAt: '2019-01-01T12:00:00.000Z',
      updatedAt: '2019-01-01T12:00:00.000Z'
    }
  ];

  let model = null;

  before(async () => {
    model = await dbExtra.init();
    await dbExtra.clean(model);
    await knexInstance.migrate.latest();
    BaseModel.knex(knexInstance);
  });

  beforeEach(async () => {
    await dbExtra.clean(model);
    try {
      await Establishment.query().insert(establishment);
      await Profile.query().insert(profiles);
      await Pil.query().insert(pils);
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

  it('sets the review date where it is missing', async () => {
    await up(knexInstance);
    const results = await knexInstance('pils').select();

    const expected = moment(pils[1].updatedAt).add(5, 'years').toISOString();
    const reviewSet = results.find(p => p.id === ids.reviewSet);
    const reviewNotSet = results.find(p => p.id === ids.reviewNotSet);

    console.log('updated_at:', pils[1].updatedAt);
    console.log('updated_at + 5 = expected:', expected);
    console.log('reviewNotSet:', reviewNotSet.reviewDate);

    assert.ok(
      isSame(new Date(reviewSet.reviewDate).toISOString(), new Date(pils[0].reviewDate).toISOString()),
      'It doesn\'t update the review_date if already set'
    );

    assert.ok(
      isSame(new Date(reviewNotSet.reviewDate).toISOString(), expected),
      'It sets the review_date as updated_at + 5 years if not set'
    );
  });
});
