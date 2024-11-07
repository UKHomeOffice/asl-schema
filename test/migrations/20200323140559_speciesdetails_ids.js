import assert from 'assert';
import objection from 'objection';
import { v4 as uuid } from 'uuid';
import isuuid from 'uuid-validate';
import pkg from 'lodash';
import diff from 'deep-diff';
import Knex from 'knex';
import moment from 'moment';
import dbExtra from '../functional/helpers/db.js';
import {transform, up} from '../../migrations/20200323140559_speciesdetails_ids.js';
import Project from '../../schema/project.js';
import BaseModel from '../../schema/base-model.js';
import Establishment from '../../schema/establishment.js';
import ProjectVersion from '../../schema/project-version.js';
import Pil from '../../schema/pil.js';
import Profile from '../../schema/profile.js';

const { knexSnakeCaseMappers } = objection;

const {cloneDeep, omit} = pkg;
describe('transform', () => {

  it('returns undefined if passed a falsy data blob', () => {
    assert.equal(transform(), undefined);
  });

  it('returns untouched input if input has no protocols', () => {
    const input = {
      title: 'Test title'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has empty protocols', () => {
    const input = {
      title: 'Test title',
      protocols: []
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has non-array protocols', () => {
    const input = {
      title: 'Test title',
      protocols: 'This should not be possible'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have no species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1' },
        { title: 'Protocol 2' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has null protocols', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1' },
        null,
        { title: 'Protocol 2' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have non-array species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', speciesDetails: 'also not theoretically possible' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have empty species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', speciesDetails: [] }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('adds id properties to speciesDetails on protocols where they are missing', () => {
    const input = {
      title: 'Test title',
      protocols: [
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' } ]
        },
        {
          title: 'Protocol 2',
          speciesDetails: [ { value: 'mice' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);
    assert.deepEqual(omit(output, 'protocols'), omit(expected, 'protocols'), 'non protocol data should be untouched');
    assert.deepEqual(output.protocols[0], expected.protocols[0], 'first protocol should be untouched');

    assert.deepEqual(omit(output.protocols[1], 'speciesDetails'), omit(expected.protocols[1], 'speciesDetails'), 'non speciesDetails data on second protocol should be untouched');

    assert.equal(output.protocols[1].speciesDetails[0].value, 'mice');
    assert.ok(isuuid(output.protocols[1].speciesDetails[0].id));
  });

  it('handles some speciesDetails on a single protocol having missing ids', () => {
    const input = {
      title: 'Test title',
      protocols: [
        null,
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' }, { value: 'rats' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);

    assert.equal(output.protocols[0], null);
    assert.ok(output.protocols[1].speciesDetails.every(sd => isuuid(sd.id)), 'all speciesDetails should have id: uuid');
  });

  it('handles some speciesDetails being null', () => {
    const input = {
      title: 'Test title',
      protocols: [
        null,
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' }, { value: 'rats' } ]
        },
        {
          title: 'Protocol 2',
          speciesDetails: [ { id: uuid(), value: 'mice' }, null, { value: 'rats' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);

    assert.equal(output.protocols[0], null);
    assert.ok(output.protocols[1].speciesDetails.every(sd => isuuid(sd.id)), 'all speciesDetails should have id: uuid');

    assert.ok(isuuid(output.protocols[2].speciesDetails[0].id), 'speciesDetails[0] should have id: uuid');
    assert.equal(output.protocols[2].speciesDetails[1], null, 'speciesDetails[1] should be null');
    assert.ok(isuuid(output.protocols[2].speciesDetails[2].id), 'speciesDetails[2] should have id: uuid');
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
    versions: uuid(),
    draft: uuid(),
    legacy: uuid(),
    noprotocols: uuid(),
    profile: uuid()
  };

  const licenceHolder = {
    id: ids.profile,
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
      id: ids.versions,
      title: 'Project with granted versions',
      licenceHolderId: licenceHolder.id,
      status: 'active',
      schemaVersion: 1,
      establishmentId: 100
    },
    {
      id: ids.draft,
      title: 'Project draft',
      licenceHolderId: licenceHolder.id,
      status: 'inactive',
      schemaVersion: 1,
      establishmentId: 100
    },
    {
      id: ids.legacy,
      title: 'Legacy Project',
      licenceHolderId: licenceHolder.id,
      status: 'active',
      schemaVersion: 0,
      establishmentId: 100
    },
    {
      id: ids.noprotocols,
      title: 'No protocols',
      licenceHolderId: licenceHolder.id,
      status: 'inactive',
      schemaVersion: 1,
      establishmentId: 100
    }
  ];

  const projectVersions = [
    {
      projectId: ids.noprotocols,
      status: 'draft',
      data: {
        title: 'No protocols'
      }
    },
    {
      projectId: ids.legacy,
      status: 'granted',
      data: {
        protocols: [
          { title: 'protocol 1' }
        ]
      },
      createdAt: '2019-01-01T12:00:00.000Z'
    },
    {
      projectId: ids.legacy,
      status: 'granted',
      data: {
        protocols: [
          { title: 'protocol 1 edited' }
        ]
      },
      createdAt: '2019-02-01T12:00:00.000Z'
    },
    {
      projectId: ids.versions,
      status: 'granted',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      createdAt: '2019-01-01T12:00:00.000Z'
    },
    {
      projectId: ids.versions,
      status: 'granted',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      createdAt: '2019-02-01T12:00:00.000Z'
    },
    {
      projectId: ids.versions,
      status: 'draft',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      createdAt: '2019-03-01T12:00:00.000Z'
    },
    {
      projectId: ids.draft,
      status: 'submitted',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      createdAt: '2019-01-01T12:00:00.000Z'
    },
    {
      projectId: ids.draft,
      status: 'draft',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'rats' }
            ]
          }
        ]
      },
      createdAt: '2019-02-01T12:00:00.000Z'
    }
  ];

  const profile = {
    id: ids.profile,
    firstName: 'Holc',
    lastName: 'Hogan',
    email: 'holc@hogan.com'
  };

  const LICENCE_NUMBER = 'SN123456';

  const pils = {
    status: 'active',
    establishmentId: 100,
    profileId: ids.profile,
    licenceNumber: LICENCE_NUMBER,
    issueDate: moment().subtract(1, 'month').toISOString()
  };

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
      await Profile.query().insert(profile);
      await Establishment.query().insert(establishment);
      await Pil.query().insert(pils);
      await Project.query().insert(projects);
      await ProjectVersion.query().insert(projectVersions);
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

  it('is ok', () => {
    assert.ok(true);
  });

  it('does not change any properties, only adds new ids', () => {
    return Promise.resolve()
      .then(() => {
        // its is objection model ('projects')= Project
        return knexInstance('projects')
          // its is objection model ('project_versions') = ProjectVersion
          .leftJoin('project_versions', 'projects.id', 'project_versions.project_id')
          .orderBy('projects.title', 'asc')
          .orderBy('project_versions.created_at', 'asc');
      })
      .then(before => {
        return Promise.resolve()
          .then(() => {
            return up(knexInstance);
          })
          .then(() => {
            return knexInstance('projects')
              .select('*')
              .leftJoin('project_versions', 'projects.id', 'project_versions.project_id')
              .orderBy('projects.title', 'asc')
              .orderBy('project_versions.created_at', 'asc');
          })
          .then(after => {
            const changes = diff(before, after);
            assert.ok(changes.every(change => {
              return change.kind === 'N' && change.path.pop() === 'id';
            }));
          });
      });
  });

  it('adds missing id properties only to the latest version', () => {
    return up(knexInstance)
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.versions)
          .orderBy('created_at', 'asc');
      })
      .then(versions => {
        versions.forEach(version => {
          if (version.status === 'granted') {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(!sd.id, 'id should not have been added to previous granted versions');
            }));
          } else {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(sd.id, 'id should have been added to latest version');
            }));
          }
        });
      });
  });

  it('adds missing id properties to drafts', () => {
    return up(knexInstance)
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.draft)
          .orderBy('created_at', 'asc');
      })
      .then(versions => {
        versions.forEach(version => {
          if (version.status === 'submitted') {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(!sd.id, 'id should not have been added to previous granted versions');
            }));
          } else {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(sd.id, 'id should have been added to latest version');
            }));
          }
        });
      });
  });

});
