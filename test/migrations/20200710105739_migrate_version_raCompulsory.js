import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {raCompulsory, up} from '../../migrations/20200710105739_migrate_version_raCompulsory.js';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import dbExtra from '../functional/helpers/db.js';
import BaseModel from '../../schema/base-model.js';
import Establishment from '../../schema/establishment.js';
import Profile from '../../schema/profile.js';
import Project from '../../schema/project.js';
import ProjectVersion from '../../schema/project-version.js';

describe('raCompulsory', () => {
  it('is false if no version', () => {
    assert.equal(raCompulsory(), false);
  });

  it('is false if no version.data', () => {
    assert.equal(raCompulsory({ foo: 'bar' }), false);
  });

  it('is false if no version.data', () => {
    assert.equal(raCompulsory({ foo: 'bar' }), false);
  });

  it('is true if species contains disallowed species', () => {
    const version = {
      data: {
        species: ['cats']
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is true if species-other disallowed species', () => {
    const version = {
      data: {
        'species-other': ['Cats']
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is false if species contains allowed species', () => {
    const version = {
      data: {
        species: ['mice']
      }
    };
    assert.equal(raCompulsory(version), false);
  });

  it('is true if project uses endangered animals', () => {
    const version = {
      data: {
        'endangered-animals': true
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is true if some protocols are severe', () => {
    const version = {
      data: {
        protocols: [
          {
            severity: 'mild'
          },
          {
            severity: 'severe'
          }
        ]
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is false if no protocols are severe', () => {
    const version = {
      data: {
        protocols: [
          {
            severity: 'mild'
          },
          {
            severity: 'moderate'
          }
        ]
      }
    };
    assert.equal(raCompulsory(version), false);
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

  const ids = {
    project: {
      active: uuid(),
      legacy: uuid()
    },
    version: {
      activeRA: uuid(),
      activeNoRA: uuid(),
      legacyDraftNoRa: uuid(),
      legacyGrantedRA: uuid()
    }
  };

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

  const projects = [
    {
      id: ids.project.active,
      establishmentId: establishment.id,
      title: 'Test project',
      licenceHolderId: licenceHolder.id,
      status: 'active',
      schemaVersion: 1
    },
    {
      id: ids.project.legacy,
      establishmentId: establishment.id,
      title: 'Legacy Project',
      licenceHolderId: licenceHolder.id,
      status: 'active',
      schemaVersion: 0
    }
  ];

  const versions = [
    {
      id: ids.version.legacyDraftNoRa,
      projectId: ids.project.legacy,
      status: 'draft',
      data: {
        title: 'Legacy no RA'
      }
    },
    {
      id: ids.version.legacyGrantedRA,
      projectId: ids.project.legacy,
      status: 'granted',
      data: {
        title: 'Legacy RA',
        species: [
          'prosimians'
        ]
      }
    },
    {
      id: ids.version.activeRA,
      projectId: ids.project.active,
      status: 'granted',
      data: {
        title: 'Granted RA',
        protocols: [
          {
            title: 'protocol 1',
            severity: 'severe'
          }
        ]
      }
    },
    {
      id: ids.version.activeNoRA,
      projectId: ids.project.active,
      status: 'granted',
      data: {
        title: 'Granted no RA',
        species: 'mice',
        protocols: [
          {
            title: 'Protocol 1',
            severity: 'mild'
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
      await ProjectVersion.query().insert(versions);
      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data in beforeEach:', error);
    }
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  it('sets ra_compulsory to true for versions where RA is required', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('project_versions').where('ra_compulsory', true))
      .then(versions => {
        const expected = [
          ids.version.legacyGrantedRA,
          ids.version.activeRA
        ];
        assert.equal(versions.length, expected.length);
        expected.forEach(id => {
          assert.ok(versions.find(version => version.id === id));
        });
      });
  });

  it('sets ra_compulsory to true for versions where RA is required', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('project_versions').where('ra_compulsory', false))
      .then(versions => {
        const expected = [
          ids.version.legacyDraftNoRa,
          ids.version.activeNoRA
        ];
        assert.equal(versions.length, expected.length);
        expected.forEach(id => {
          assert.ok(versions.find(version => version.id === id));
        });
      });
  });
});
