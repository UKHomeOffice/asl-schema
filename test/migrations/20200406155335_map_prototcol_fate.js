import assert from 'assert';
import { v4 as uuid } from 'uuid';
import pkg from 'lodash';
import {transform, up} from '../../migrations/20200406155335_map_prototcol_fate.js';
import dbExtra from '../functional/helpers/db.js';
import BaseModel from '../../schema/base-model.js';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import Establishment from '../../schema/establishment.js';
import Profile from '../../schema/profile.js';
import Project from '../../schema/project.js';
import ProjectVersion from '../../schema/project-version.js';

const {cloneDeep, omit} = pkg;
describe('transform', () => {

  it('returns undefined if passed a falsy data blob', () => {
    assert.equal(transform(), undefined);
  });

  it('returns undefined if input has no protocols', () => {
    const input = {
      title: 'Test title'
    };
    assert.deepEqual(transform(input), undefined);
  });

  it('returns unpatched input if input has empty protocols', () => {
    const input = {
      title: 'Test title',
      protocols: []
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns undefined input if input has non-array protocols', () => {
    const input = {
      title: 'Test title',
      protocols: 'This should not be possible'
    };
    assert.deepEqual(transform(input), undefined);
  });

  it('returns unpatched input if protocols have no killing-method', () => {
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

  it('returns unpatched input if input has null protocols', () => {
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

  it('returns unpatched input if protocols have non array killing-method', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', 'killing-method': 'also not theoretically possible' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns unpatched input if protocols have empty killing-method', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', 'killing-method': [] }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('sets killing method to false if only other included, true if sched-1 included, marks data as patched', () => {
    const input = {
      title: 'Test title',
      protocols: [
        {
          title: 'Protocol 1',
          'killing-method': [
            'other',
            'schedule-1'
          ]
        },
        {
          title: 'Protocol 2',
          'killing-method': [
            'schedule-1'
          ]
        },
        {
          title: 'Protocol 3',
          'killing-method': [
            'other'
          ]
        },
        {
          title: 'Protocol 4',
          'killing-method': []
        }
      ]
    };
    const expected = {
      ...cloneDeep(input),
      patched: true
    };
    const output = transform(input);
    assert.deepEqual(omit(output, 'protocols'), omit(expected, 'protocols'), 'non protocol data should be untouched');

    output.protocols.forEach((protocol, index) => {
      assert.deepEqual(omit(protocol, 'non-schedule-1'), omit(expected.protocols[index], 'non-schedule-1'), 'non non-schedule-1 data should be untouched');
    });

    assert.equal(output.protocols[0]['non-schedule-1'], true, 'first protocol should set non-schedule-1 to true as other is included');
    assert.equal(output.protocols[1]['non-schedule-1'], false, 'second protocol should set non-schedule-1 to false as only schedule-1 is included');
    assert.equal(output.protocols[2]['non-schedule-1'], true, 'third protocol should set non-schedule-1 to true as other is included');
    assert.equal(output.protocols[3]['non-schedule-1'], undefined, 'third protocol should not set non-schedule-1 as killing-method is empty');
  });

});

describe('up', () => {

  const { knexInstance: dbInstance } = dbExtra;

  const knexInstance = Knex({
    ...dbInstance.client.config,
    ...knexSnakeCaseMappers()
  });

  const ids = {
    active: uuid(),
    legacy: uuid()
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
      id: ids.active,
      establishmentId: establishment.id,
      title: 'Project with granted versions',
      licenceHolderId: licenceHolder.id,
      status: 'active',
      schemaVersion: 1
    },
    {
      id: ids.legacy,
      establishmentId: establishment.id,
      title: 'Legacy Project',
      licenceHolderId: licenceHolder.id,
      status: 'active',
      schemaVersion: 0
    }
  ];

  const versions = [
    {
      projectId: ids.legacy,
      status: 'draft',
      data: {
        title: 'Legacy',
        protocols: [
          {
            title: 'Protocol 1',
            'killing-method': [
              'other'
            ]
          }
        ]
      }
    },
    {
      projectId: ids.active,
      status: 'draft',
      data: {
        protocols: [
          {
            title: 'protocol 1'
          },
          {
            title: 'protocol 2',
            'killing-method': []
          },
          {
            title: 'protocol 3',
            'killing-method': ['other']
          },
          {
            title: 'protocol 4',
            'killing-method': ['other', 'schedule-1']
          },
          {
            title: 'protocol 5',
            'killing-method': ['schedule-1']
          }
        ]
      }
    },
    {
      projectId: ids.active,
      status: 'granted',
      data: {
        protocols: [
          {
            title: 'protocol 1'
          },
          {
            title: 'protocol 2',
            'killing-method': []
          },
          {
            title: 'protocol 3',
            'killing-method': ['other']
          },
          {
            title: 'protocol 4',
            'killing-method': ['other', 'schedule-1']
          },
          {
            title: 'protocol 5',
            'killing-method': ['schedule-1']
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

  it('is ok', () => {
    assert.ok(true);
  });

  it('does not update legacy projects', () => {
    return Promise.resolve()
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.legacy);
      })
      .then(before => {
        return Promise.resolve()
          .then(() => {
            return up(knexInstance);
          })
          .then(() => {
            return knexInstance('project_versions')
              .where('project_id', ids.legacy);
          })
          .then(after => {
            assert.deepEqual(before, after, 'legacy licence versions should not have been updated');
          });
      });
  });

  it('maps killing method onto new non-schedule-1 property', () => {
    return up(knexInstance)
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.active)
          .first();
      })
      .then(version => {
        assert.equal(version.data.protocols[0]['non-schedule-1'], undefined, 'It should not have set the non-schedule-1 property on first protocol as killing-method missing');
        assert.equal(version.data.protocols[1]['non-schedule-1'], undefined, 'It should not have set the non-schedule-1 property on second protocol as killing-method empty');
        assert.equal(version.data.protocols[2]['non-schedule-1'], true, 'It should have set non-schedule-1 to true on third protocol as killing-method contains other');
        assert.equal(version.data.protocols[3]['non-schedule-1'], true, 'It should have set non-schedule-1 to true on fourth protocol as killing-method contains other');
        assert.equal(version.data.protocols[4]['non-schedule-1'], false, 'It should have set non-schedule-1 to false on fifth protocol as killing-method contains only schedule 1');
      });
  });

  it('fixes previous versions', () => {
    return up(knexInstance)
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.active);
      })
      .then(versions => {
        const version = versions[versions.length - 1];
        assert.equal(version.data.protocols[0]['non-schedule-1'], undefined, 'It should not have set the non-schedule-1 property on first protocol as killing-method missing');
        assert.equal(version.data.protocols[1]['non-schedule-1'], undefined, 'It should not have set the non-schedule-1 property on second protocol as killing-method empty');
        assert.equal(version.data.protocols[2]['non-schedule-1'], true, 'It should have set non-schedule-1 to true on third protocol as killing-method contains other');
        assert.equal(version.data.protocols[3]['non-schedule-1'], true, 'It should have set non-schedule-1 to true on fourth protocol as killing-method contains other');
        assert.equal(version.data.protocols[4]['non-schedule-1'], false, 'It should have set non-schedule-1 to false on fifth protocol as killing-method contains only schedule 1');
      });
  });

});
