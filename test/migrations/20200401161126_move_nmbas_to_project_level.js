import assert from 'assert';
import pkg from 'lodash';
import { v4 as uuid } from 'uuid';
import diff from 'deep-diff';
import dbExtra from '../functional/helpers/db.js';
import {transform, up} from '../../migrations/20200401161126_move_nmbas_to_project_level.js';
import BaseModel from '../../schema/base-model.js';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import Establishment from '../../schema/establishment.js';
import ProjectVersion from '../../schema/project-version.js';
import Profile from '../../schema/profile.js';
import Project from '../../schema/project.js';

const {cloneDeep} = pkg;
describe('Move NMBAs to project level', () => {
  const { knexInstance: dbInstance } = dbExtra;

  const knexInstance = Knex({
    ...dbInstance.client.config,
    ...knexSnakeCaseMappers()
  });

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

    it('copes with null protocols', () => {
      const input = {
        title: 'Test title',
        protocols: [
          { title: 'Protocol 1' },
          null,
          {
            title: 'Protocol 2',
            steps: [
              {
                nmbas: true
              }
            ]
          }
        ]
      };

      const expected = cloneDeep(input);
      expected['nmbas-used'] = true;
      assert.deepEqual(transform(input), expected);
    });

    it('returns untouched input if protocols have no steps', () => {
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

    it('does not add nmbas-used property to version data if no steps have nmbas set to true', () => {
      const input = {
        title: 'Test title',
        protocols: [
          { title: 'Protocol 1' },
          {
            title: 'Protocol 2',
            steps: [
              {
                nmbas: false
              },
              {
                nmbas: false
              },
              {
                nmbas: false
              }
            ]
          }
        ]
      };

      const expected = cloneDeep(input);
      assert.deepEqual(transform(input), expected);
    });

    it('adds nmbas-used property to version data if any steps have nmbas set to true', () => {
      const input = {
        title: 'Test title',
        protocols: [
          {
            title: 'Protocol 1',
            steps: [
              {
                nmbas: false
              }
            ]
          },
          {
            title: 'Protocol 2',
            steps: [
              {
                nmbas: false
              },
              {
                nmbas: true
              },
              {
                nmbas: false
              }
            ]
          }
        ]
      };

      const expected = cloneDeep(input);
      expected['nmbas-used'] = true;
      assert.deepEqual(transform(input), expected);
    });

    it('copes with null steps', () => {
      const input = {
        title: 'Test title',
        protocols: [
          {
            title: 'Protocol 1',
            steps: [
              null,
              {
                nmbas: true
              }
            ]
          },
          { title: 'Protocol 2' }
        ]
      };
      const expected = cloneDeep(input);
      expected['nmbas-used'] = true;
      assert.deepEqual(transform(input), expected);
    });

  });

  describe('up', () => {
    const ids = {
      active: uuid(),
      draft: uuid(),
      legacy: uuid(),
      noProtocols: uuid(),
      noNmbas: uuid()
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
        title: 'Active Project',
        licenceHolderId: licenceHolder.id,
        status: 'active',
        schemaVersion: 1
      },
      {
        id: ids.draft,
        establishmentId: establishment.id,
        title: 'Draft Project',
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
      },
      {
        id: ids.noProtocols,
        establishmentId: establishment.id,
        title: 'No protocols',
        licenceHolderId: licenceHolder.id,
        status: 'inactive',
        schemaVersion: 1
      },
      {
        id: ids.noNmbas,
        establishmentId: establishment.id,
        title: 'Project no NMBAs',
        licenceHolderId: licenceHolder.id,
        status: 'active',
        schemaVersion: 1
      }
    ];

    const versions = [
      {
        projectId: ids.noProtocols,
        status: 'draft',
        data: {
          title: 'No protocols'
        }
      },
      {
        projectId: ids.legacy,
        status: 'granted',
        data: {
          title: 'Legacy Project',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: true
                }
              ]
            }
          ]
        }
      },
      {
        projectId: ids.active,
        status: 'granted',
        data: {
          title: 'Active Project',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: false
                },
                {
                  nmbas: false
                },
                {
                  nmbas: false
                }
              ]
            },
            {
              title: 'protocol 2',
              steps: [
                {
                  nmbas: true
                },
                {
                  nmbas: false
                }
              ]
            }
          ]
        }
      },
      {
        projectId: ids.active,
        status: 'granted',
        data: {
          title: 'Active Project',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: true
                }
              ]
            }
          ]
        }
      },
      {
        projectId: ids.active,
        status: 'draft',
        data: {
          title: 'Active Project',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: true
                }
              ]
            }
          ]
        }
      },
      {
        projectId: ids.draft,
        status: 'submitted',
        data: {
          title: 'Draft Project',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: true
                }
              ]
            }
          ]
        }
      },
      {
        projectId: ids.draft,
        status: 'draft',
        data: {
          title: 'Draft Project',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: true
                }
              ]
            }
          ]
        }
      },
      {
        projectId: ids.noNmbas,
        status: 'granted',
        data: {
          title: 'Project no NMBAs',
          protocols: [
            {
              title: 'protocol 1',
              steps: [
                {
                  nmbas: false
                }
              ]
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

    it('does not change any properties, only adds nmbas-used', () => {
      return Promise.resolve()
        .then(() => knexInstance('project_versions').select('project_versions.*').orderBy('id'))
        .then(before => {
          return Promise.resolve()
            .then(() => {
              return up(knexInstance);
            })
            .then(() => knexInstance('project_versions').select('project_versions.*').orderBy('id'))
            .then(after => {
              const changes = diff(before, after);
              assert.ok(changes.every(change => {
                return change.kind === 'N' && change.path[change.path.length - 1] === 'nmbas-used';
              }));
            });
        });
    });

    it('does not add nmbas-used to schema v0 versions', () => {
      return up(knexInstance)
        .then(() => {
          return knexInstance('project_versions')
            .join('projects', 'project_versions.project_id', 'projects.id')
            .where('projects.schema_version', 0);
        })
        .then(versions => {
          versions.forEach(version => {
            assert.equal(version.data['nmbas-used'], undefined, 'nmbas-used should not be added to legacy versions');
          });
        });
    });

    it('adds nmbas-used to schema v1 versions when used in any protocol step', () => {
      return up(knexInstance)
        .then(() => {
          return knexInstance('project_versions')
            .select('project_versions.*')
            .join('projects', 'project_versions.project_id', 'projects.id')
            .where('projects.schema_version', 1);
        })
        .then(versions => {
          versions.forEach(version => {
            if ([ids.noNmbas, ids.noProtocols].includes(version.projectId)) {
              assert.equal(version.data['nmbas-used'], undefined, 'nmbas-used should not be added to version data');
            } else {
              assert.ok(version.data['nmbas-used'], 'nmbas-used should be added to version data');
            }
          });
        });
    });

  });

});
