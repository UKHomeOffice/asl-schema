import assert from 'assert';
import { v4 as uuid } from 'uuid';
import pkg from 'lodash';
import {transform, up} from '../../migrations/20200406154728_migrate_fate_of_animals_killed.js';
import dbExtra from '../functional/helpers/db.js';
import BaseModel from '../../schema/base-model.js';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import Establishment from '../../schema/establishment.js';
import Profile from '../../schema/profile.js';
import Project from '../../schema/project.js';
import ProjectVersion from '../../schema/project-version.js';

const {cloneDeep} = pkg;

function getVersion(versions, title) {
  return versions.find(v => v.data.title === title);
}

describe('transform', () => {

  it('returns undefined if passed a falsy data blob', () => {
    assert.equal(transform(), undefined);
  });

  it('returns untouched input if input if fate-of-animals-nts is undefined', () => {
    const input = {
      title: 'Test title'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input if fate-of-animals-nts is true', () => {
    const input = {
      title: 'Test title',
      'fate-of-animals-nts': true
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('adds killed to fate-of-animals if fate-of-animals-nts is false', () => {
    const input = {
      title: 'Test title',
      'fate-of-animals-nts': false
    };
    const output = transform(input);
    const expected = ['killed'];
    assert.deepEqual(output['fate-of-animals'], expected);
  });

  it('adds killed to fate-of-animals if fate-of-animals-nts is false', () => {
    const input = {
      title: 'Test title',
      'fate-of-animals-nts': false,
      'fate-of-animals': [
        'set-free',
        'rehomed'
      ]
    };
    const output = transform(input);
    const expected = [
      'set-free',
      'rehomed',
      'killed'
    ];
    assert.deepEqual(output['fate-of-animals'], expected);
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
    draft: uuid(),
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
      id: ids.draft,
      establishmentId: establishment.id,
      title: 'Project draft',
      licenceHolderId: licenceHolder.id,
      status: 'inactive',
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
      status: 'granted',
      data: {
        title: 'should not alter',
        'fate-of-animals-nts': false,
        'fate-of-animals': [
          'set-free'
        ]
      }
    },
    {
      projectId: ids.active,
      status: 'granted',
      data: {
        title: 'should not add killed',
        'fate-of-animals-nts': true,
        'fate-of-animals': [
          'set-free'
        ]
      }
    },
    {
      projectId: ids.active,
      status: 'granted',
      data: {
        title: 'should add killed, fate undefined',
        'fate-of-animals-nts': false
      }
    },
    {
      projectId: ids.active,
      status: 'granted',
      data: {
        title: 'should not add killed twice',
        'fate-of-animals-nts': false,
        'fate-of-animals': [
          'killed'
        ]
      }
    },
    {
      projectId: ids.active,
      status: 'draft',
      data: {
        title: 'Should add killed, existing fate',
        'fate-of-animals-nts': false,
        'fate-of-animals': [
          'set-free'
        ]
      }
    },
    {
      projectId: ids.draft,
      status: 'draft',
      data: {
        title: 'should add killed draft',
        'fate-of-animals-nts': false,
        'fate-of-animals': [
          'set-free'
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

  it('doesn\'t touch legacy versions', () => {
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
            assert.deepEqual(before, after);
          });
      });
  });

  it('updates draft versions', () => {
    return Promise.resolve()
      .then(() => {
        return up(knexInstance);
      })
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.draft)
          .first();
      })
      .then(version => {
        const expected = [
          'set-free',
          'killed'
        ];
        assert.deepEqual(version.data['fate-of-animals'], expected);
      });
  });

  it('updates active project granted and previous versions', () => {
    return Promise.resolve()
      .then(() => {
        return knexInstance('project_versions')
          .where('project_id', ids.active);
      })
      .then(before => {
        return Promise.resolve()
          .then(() => {
            return up(knexInstance);
          })
          .then(() => {
            return knexInstance('project_versions')
              .where('project_id', ids.active);
          })
          .then(after => {
            assert.deepEqual(
              getVersion(before, 'should not add killed'),
              getVersion(after, 'should not add killed')
            );
            assert.deepEqual(
              getVersion(after, 'should add killed, fate undefined').data['fate-of-animals'],
              ['killed']
            );
            assert.deepEqual(
              getVersion(after, 'should not add killed twice').data['fate-of-animals'],
              ['killed']
            );
            assert.deepEqual(
              getVersion(after, 'Should add killed, existing fate').data['fate-of-animals'],
              ['set-free', 'killed']
            );
          });
      });
  });
});
