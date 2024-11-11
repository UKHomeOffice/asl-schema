import { v4 as uuid } from 'uuid';
import assert from 'assert';
import isUuid from 'uuid-validate';
import diff from 'deep-diff';
import {up, transform} from '../../migrations/20200501141527_assign_ids_to_continuation.js';
import dbExtra from '../functional/helpers/db.js';
import BaseModel from '../../schema/base-model.js';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import Establishment from '../../schema/establishment.js';
import Profile from '../../schema/profile.js';
import Project from '../../schema/project.js';
import ProjectVersion from '../../schema/project-version.js';

describe('transform', () => {
  it('returns undefined if called without data', () => {
    assert.equal(transform(), undefined);
  });

  it('returns undefined if project-continuation missing', () => {
    const before = {
      field: 'value'
    };
    assert.equal(transform(before), undefined);
  });

  it('returns undefined if project-continuation not an array', () => {
    const before = {
      'project-continuation': true
    };
    assert.equal(transform(before), undefined);
  });

  it('assigns uuids to each continuation item missing an id', () => {
    const before = {
      'project-continuation': [
        {
          id: uuid(),
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        },
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        },
        {
          'licence-number': null,
          'expiry-date': null
        }
      ]
    };

    const after = transform(before);

    assert.ok(after['project-continuation'].every(item => isUuid(item.id)));
  });

});

describe('up', () => {
  const knexInstance = Knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'test-password',
      database: 'asl-test'
    },
    ...knexSnakeCaseMappers()
  });

  const licenceHolder = {
    id: uuid(),
    firstName: 'Licence',
    lastName: 'Holder',
    email: 'test@example.com'
  };

  const establishment = {
    id: 100,
    name: 'An establishment',
    email: 'an@establishment.com',
    country: 'england',
    address: '123 Somwhere street'
  };

  const ids = {
    legacyProject: uuid(),
    activeProject: uuid(),
    legacyVersion: uuid(),
    noContinuation: uuid(),
    missingContinuationIds: uuid()
  };

  const projects = [
    {
      id: ids.legacyProject,
      establishmentId: establishment.id,
      title: 'Legacy',
      schemaVersion: 0,
      licenceHolderId: licenceHolder.id
    },
    {
      id: ids.activeProject,
      establishmentId: establishment.id,
      title: 'Continuation',
      schemaVersion: 1,
      status: 'active',
      licenceHolderId: licenceHolder.id
    }
  ];

  const projectVersionsData = [
    {
      id: ids.legacyVersion,
      projectId: ids.legacyProject,
      data: {
        title: 'Legacy version'
      }
    },
    {
      id: ids.noContinuation,
      projectId: ids.activeProject,
      data: {
        title: 'No continuation'
      }
    },
    {
      id: ids.missingContinuationIds,
      projectId: ids.activeProject,
      data: {
        title: 'Missing continuations ids',
        'project-continuation': [
          {
            id: uuid(),
            'licence-number': '70/1234',
            'expiry-date': '2020-06-30'
          },
          {
            'licence-number': '70/1234',
            'expiry-date': '2020-06-30'
          },
          {
            'licence-number': null,
            'expiry-date': null
          }
        ]
      }
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
      await Profile.query().insert(licenceHolder);
      await Project.query().insert(projects);
      await ProjectVersion.query().insert(projectVersionsData);
      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data in beforeEach:', error);
    }
  });

  it('doesn\'t touch legacy versions', () => {
    return Promise.resolve()
      .then(() => knexInstance('project_versions').where({ id: ids.legacyVersion }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where({ id: ids.legacyVersion }).first())
          .then(after => {
            assert.deepEqual(before, after);
          });
      });
  });

  it('doesn\'t touch non continuations', () => {
    return Promise.resolve()
      .then(() => knexInstance('project_versions').where({ id: ids.noContinuation }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where({ id: ids.noContinuation }).first())
          .then(after => {
            assert.deepEqual(before, after);
          });
      });
  });

  it('assigns ids where missing', () => {
    return Promise.resolve()
      .then(() => knexInstance('project_versions').where({ id: ids.missingContinuationIds }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where({ id: ids.missingContinuationIds }).first())
          .then(after => {
            const changes = diff(before.data, after.data);
            assert.ok(changes.every(change => {
              return change.kind === 'N' && change.path.pop() === 'id';
            }));
          });
      });
  });
});
