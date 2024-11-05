import assert from 'assert';
import { v4 as uuidv4 } from 'uuid';
import db from '../functional/helpers/db.js';

// Define unique IDs
const ids = {
  asru: uuidv4(),
  profiles: [uuidv4(), uuidv4(), uuidv4(), uuidv4()],
  pils: [uuidv4()],
  project: uuidv4()
};

describe('Billing queries model', function () {
  let models;

  // Helper function to insert profiles
  const insertProfiles = async () => {
    try {
      const result = await models.Profile.query().insert([
        { id: ids.asru, firstName: 'Asru', lastName: 'Admin', email: 'asruadmin@example.com' },
        { id: ids.profiles[0], firstName: 'Jeff', lastName: 'Winger', email: 'jw@example.com' },
        { id: ids.profiles[1], firstName: 'Abed', lastName: 'Nadir', email: 'an@example.com' },
        { id: ids.profiles[2], firstName: 'Troy', lastName: 'Barnes', email: 'tb@example.com' },
        { id: ids.profiles[3], firstName: 'Annie', lastName: 'Edison', email: 'ae@example.com' },
        { id: ids.pils[0], firstName: 'Robert', lastName: 'Oppenheimer', email: 'ro@example.com' }
      ]);
      console.log('result: --- ', result);
    } catch (error) {
      console.log('error: ', error);
    }

  };

  // Helper function to insert establishments with nested relationships
  const insertEstablishments = async () => {
    await models.Establishment.query().insertGraph([
      {
        id: 100,
        name: 'Training Establishment',
        projects: [{ id: ids.project, title: 'Training Project', status: 'active' }]
      },
      {
        id: 101,
        name: 'Research Establishment',
        pils: [
          { issueDate: '2020-04-01T12:00:00Z', status: 'active', procedures: ['A'], species: ['mice'], profileId: ids.profiles[3] },
          { issueDate: '2020-04-01T12:00:00Z', status: 'active', procedures: ['A'], species: ['mice'], profileId: ids.pils[0] }
        ]
      }
    ]);
  };

  // Helper function to insert training courses and fees
  const insertTrainingCoursesAndFees = async () => {
    await models.TrainingCourse.query().insertGraph([
      {
        establishmentId: 100,
        title: 'Training Course',
        projectId: ids.project,
        startDate: '2020-04-01',
        trainingPils: [
          { profileId: ids.profiles[0], issueDate: '2020-04-01T12:00:00Z', expiryDate: '2020-07-01T12:00:00Z', status: 'expired' },
          { profileId: ids.profiles[1], issueDate: '2020-04-01T12:00:00Z', expiryDate: '2020-07-01T12:00:00Z', revocationDate: '2020-04-04T12:00:00Z', status: 'revoked' },
          { profileId: ids.profiles[2], issueDate: '2020-04-01T12:00:00Z', expiryDate: '2020-07-01T12:00:00Z', revocationDate: '2020-04-07T12:00:00Z', status: 'revoked' },
          { profileId: ids.profiles[3], issueDate: '2020-04-01T12:00:00Z', expiryDate: '2020-07-01T12:00:00Z', status: 'expired' }
        ]
      }
    ]);

    await models.FeeWaiver.query().insertGraph([
      { establishmentId: 100, profileId: ids.profiles[3], year: 2020, waivedById: ids.asru }
    ]);
  };

  before(async () => {
    models = db.init();
    await db.clean(models);

    await insertProfiles();
    await insertEstablishments();
    await insertTrainingCoursesAndFees();
  });

  after(async () => {
    await db.clean(models);
    await models.destroy();
  });

  describe('billable', () => {

    it('includes training PILs in billing data', async () => {
      const result = await models.Profile.query().whereHasBillablePIL({
        establishmentId: 100,
        start: '2020-04-06',
        end: '2021-04-05'
      });
      console.log('Billing data:', result);
      assert.equal(result.length, 3);
    });

    it('excludes training PILs revoked before start of year', async () => {
      const result = await models.Profile.query().whereHasBillablePIL({
        establishmentId: 100,
        start: '2020-04-06',
        end: '2021-04-05'
      });
      assert.ok(!result.map(p => p.email).includes('an@example.com'), 'Result should not include Abed Nadir');
    });

    it('excludes waived PILs if `whereNotWaived` is applied', async () => {
      const result = await models.Profile.query().whereHasBillablePIL({
        establishmentId: 100,
        start: '2020-04-06',
        end: '2021-04-05'
      }).whereNotWaived();

      assert.equal(result.length, 2);
      assert.ok(!result.map(p => p.email).includes('ae@example.com'), 'Result should not include Annie Edison');
    });

    it('does not exclude waived PILs for other years if `whereNotWaived` is applied', async () => {
      const result = await models.Profile.query().whereHasBillablePIL({
        establishmentId: 100,
        start: '2019-04-06',
        end: '2020-04-05'
      }).whereNotWaived();

      assert.equal(result.length, 4);
      assert.ok(result.map(p => p.email).includes('ae@example.com'), 'Result should include Annie Edison');
    });

    it('includes ordinary PILs where a PIL-E is waived elsewhere', async () => {
      const result = await models.Profile.query().whereHasBillablePIL({
        establishmentId: 101,
        start: '2020-04-06',
        end: '2021-04-05'
      }).whereNotWaived();

      assert.equal(result.length, 2);
      assert.ok(result.map(p => p.email).includes('ae@example.com'), 'Result should include Annie Edison');
    });
  });
});
