const assert = require('assert');
const { cloneDeep } = require('lodash');
const uuid = require('uuid/v4');
const diff = require('deep-diff');
const db = require('./helpers/db');
const { transform, up } = require('../../migrations/20200401161126_move_nmbas_to_project_level');

const util = require('util')

describe('Move NMBAs to project level', () => {

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
      first_name: 'Licence',
      last_name: 'Holder',
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
        title: 'Active Project',
        licence_holder_id: licenceHolder.id,
        status: 'active',
        schema_version: 1
      },
      {
        id: ids.draft,
        title: 'Draft Project',
        licence_holder_id: licenceHolder.id,
        status: 'inactive',
        schema_version: 1
      },
      {
        id: ids.legacy,
        title: 'Legacy Project',
        licence_holder_id: licenceHolder.id,
        status: 'active',
        schema_version: 0
      },
      {
        id: ids.noProtocols,
        title: 'No protocols',
        licence_holder_id: licenceHolder.id,
        status: 'inactive',
        schema_version: 1
      },
      {
        id: ids.noNmbas,
        title: 'Project no NMBAs',
        licence_holder_id: licenceHolder.id,
        status: 'active',
        schema_version: 1
      },
    ];

    const versions = [
      {
        project_id: ids.noProtocols,
        status: 'draft',
        data: {
          title: 'No protocols'
        }
      },
      {
        project_id: ids.legacy,
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
        project_id: ids.active,
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
        project_id: ids.active,
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
        project_id: ids.active,
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
        project_id: ids.draft,
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
        project_id: ids.draft,
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
        project_id: ids.noNmbas,
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

    before(() => {
      this.knex = db.init();
    });

    beforeEach(() => {
      return Promise.resolve()
        .then(() => db.clean(this.knex))
        .then(() => this.knex('establishments').insert(establishment))
        .then(() => this.knex('profiles').insert(licenceHolder))
        .then(() => this.knex('projects').insert(projects))
        .then(() => this.knex('project_versions').insert(versions));
    });

    afterEach(() => {
      return db.clean(this.knex);
    });

    after(() => {
      return this.knex.destroy();
    });

    it('is ok', () => {
      assert.ok(true);
    });

    it('does not change any properties, only adds nmbas-used', () => {
      return Promise.resolve()
        .then(() => this.knex('project_versions').select('project_versions.*').orderBy('id'))
        .then(before => {
          return Promise.resolve()
            .then(() => {
              return up(this.knex);
            })
            .then(() => this.knex('project_versions').select('project_versions.*').orderBy('id'))
            .then(after => {
              const changes = diff(before, after);
              assert.ok(changes.every(change => {
                return change.kind === 'N' && change.path.pop() === 'nmbas-used';
              }));
            })
        });
    });

    it('does not add nmbas-used to schema v0 versions', () => {
      return up(this.knex)
        .then(() => {
          return this.knex('project_versions')
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
      return up(this.knex)
        .then(() => {
          return this.knex('project_versions')
            .select('project_versions.*')
            .join('projects', 'project_versions.project_id', 'projects.id')
            .where('projects.schema_version', 1);
        })
        .then(versions => {
          versions.forEach(version => {
            if ([ids.noNmbas, ids.noProtocols].includes(version.project_id)) {
              assert.equal(version.data['nmbas-used'], undefined, 'nmbas-used should not be added to version data');
            } else {
              assert.ok(version.data['nmbas-used'], 'nmbas-used should be added to version data');
            }
          });
        });
    });

  });

});
