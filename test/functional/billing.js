import assert from 'assert';
import { v4 as uuid } from 'uuid';
import dbExtra from './helpers/db.js';
import Knex from 'knex';
import BaseModel from '../../schema/base-model.js';
import Profile from '../../schema/profile.js';
import Establishment from '../../schema/establishment.js';
import TrainingCourse from '../../schema/training-course.js';
import FeeWaiver from '../../schema/fee-waiver.js';

// Define unique IDs
const ids = {
  asru: uuid(),
  piles: [uuid(), uuid(), uuid(), uuid()],
  pils: [uuid()],
  ppl: uuid()
};
const { knexInstance: dbInstance } = dbExtra;

const knexInstance = Knex({
  ...dbInstance.client.config
});

describe('Billing queries model', () => {

  let model = null;

  before(async () => {
    model = await dbExtra.init();
    await dbExtra.clean(model);
    BaseModel.knex(knexInstance);
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  describe('billable', () => {

    before(async () => {
      try {
        await Profile.query().insert([
          {
            id: ids.asru,
            firstName: 'Asru',
            lastName: 'Admin',
            email: 'asruadmin@example.com'
          },
          {
            id: ids.piles[0],
            firstName: 'Jeff',
            lastName: 'Winger',
            email: 'jw@example.com'
          },
          {
            id: ids.piles[1],
            firstName: 'Abed',
            lastName: 'Nadir',
            email: 'an@example.com'
          },
          {
            id: ids.piles[2],
            firstName: 'Troy',
            lastName: 'Barnes',
            email: 'tb@example.com'
          },
          {
            id: ids.piles[3],
            firstName: 'Annie',
            lastName: 'Edison',
            email: 'ae@example.com'
          },
          {
            id: ids.pils[0],
            firstName: 'Robert',
            lastName: 'Oppenheimer',
            email: 'ro@example.com'
          }
        ]);
        await Establishment.query().insertGraph([
          {
            id: 100,
            name: 'Training Establishment',
            projects: [
              {
                id: ids.ppl,
                title: 'Training Project',
                status: 'active'
              }
            ]
          },
          {
            id: 101,
            name: 'Research Establishment',
            pils: [
              {
                issueDate: '2020-04-01T12:00:00Z',
                status: 'active',
                procedures: ['A'],
                species: ['mice'],
                profileId: ids.piles[3]
              },
              {
                issueDate: '2020-04-01T12:00:00Z',
                status: 'active',
                procedures: ['A'],
                species: ['mice'],
                profileId: ids.pils[0]
              }
            ]
          }
        ]);
        await TrainingCourse.query().insertGraph([
          {
            establishmentId: 100,
            title: 'Training Course',
            projectId: ids.ppl,
            startDate: '2020-04-01',
            species: [],
            trainingPils: [
              {
                // expired naturally
                profileId: ids.piles[0],
                issueDate: '2020-04-01T12:00:00Z',
                expiryDate: '2020-07-01T12:00:00Z',
                revocationDate: null,
                status: 'expired'
              },
              {
                // revoked before start of period
                profileId: ids.piles[1],
                issueDate: '2020-04-01T12:00:00Z',
                expiryDate: '2020-07-01T12:00:00Z',
                revocationDate: '2020-04-04T12:00:00Z',
                status: 'revoked'
              },
              {
                // revoked after start of period
                profileId: ids.piles[2],
                issueDate: '2020-04-01T12:00:00Z',
                expiryDate: '2020-07-01T12:00:00Z',
                revocationDate: '2020-04-07T12:00:00Z',
                status: 'revoked'
              },
              {
                // waived
                profileId: ids.piles[3],
                issueDate: '2020-04-01T12:00:00Z',
                expiryDate: '2020-07-01T12:00:00Z',
                revocationDate: null,
                status: 'expired'
              }
            ]
          }
        ]);
        await FeeWaiver.query().insert(
          {
            establishmentId: 100,
            profileId: ids.piles[3],
            year: 2020,
            waivedById: ids.asru
          }
        );
        console.log('Data insert successfully!!!');
      } catch (error) {
        console.log('insert unsuccessful: ', error);
      }
    });

    it('includes training pils in billing data', async () => {
      const result = await Profile.query().whereHasBillablePIL({ establishmentId: 100, start: '2020-04-06', end: '2021-04-05' });
      assert.equal(result.length, 3);
    });

    it('excludes training pils revoked before start of year', async () => {
      const result = await Profile.query().whereHasBillablePIL({ establishmentId: 100, start: '2020-04-06', end: '2021-04-05' });
      assert.ok(!result.map(p => p.email).includes('an@example.com'), 'result should not include Abed Nadir');
    });

    it('excludes waived PILs if `whereNotWaived` is applied', async () => {
      const result = await Profile.query()
        .whereHasBillablePIL({ establishmentId: 100, start: '2020-04-06', end: '2021-04-05' })
        .whereNotWaived();
      assert.equal(result.length, 2);
      assert.ok(!result.map(p => p.email).includes('ae@example.com'), 'result should not include Annie Edison');
    });

    it('does not exclude waived PILs for other years if `whereNotWaived` is applied', async () => {
      const result = await Profile.query()
        .whereHasBillablePIL({ establishmentId: 100, start: '2019-04-06', end: '2020-04-05' })
        .whereNotWaived();
      assert.equal(result.length, 4);
      assert.ok(result.map(p => p.email).includes('ae@example.com'), 'result should include Annie Edison');
    });

    it('includes ordinary PILs where a PIL-E is waived elsewhere', async () => {
      const result = await Profile.query()
        .whereHasBillablePIL({ establishmentId: 101, start: '2020-04-06', end: '2021-04-05' })
        .whereNotWaived();
      assert.equal(result.length, 2);
      assert.ok(result.map(p => p.email).includes('ae@example.com'), 'result should include Annie Edison');
    });

  });

});
