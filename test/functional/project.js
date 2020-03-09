const { every } = require('lodash');
const assert = require('assert');
const db = require('./helpers/db');
const moment = require('moment');

describe('Project model', () => {

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.Profile.query().insert([
        {
          id: '781d8d17-9c00-4f3d-8734-c1a469426546',
          firstName: 'Vincent',
          lastName: 'Malloy',
          email: 'vincent@price.com'
        },
        {
          id: '0ae5d4d5-7400-4462-b9fe-22bdf446792e',
          firstName: 'Sterling',
          lastName: 'Archer',
          email: 'sterling@archer.com'
        }
      ]))
      .then(() => this.models.Establishment.query().upsertGraph({
        id: 8201,
        name: 'An establishment',
        email: 'an@establishment.com',
        country: 'england',
        address: '123 Somwhere street',
        projects: [
          {
            title: 'Anti cancer research',
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            },
            status: 'inactive',
            version: [
              {
                status: 'draft'
              }
            ]
          },
          {
            title: 'Some expired research',
            expiryDate: moment().subtract(6, 'M').format(),
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            },
            status: 'expired'
          },
          {
            title: 'Some more research',
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            },
            status: 'inactive',
            version: [
              {
                status: 'submitted'
              }
            ]
          },
          {
            title: 'Some more expired research',
            expiryDate: moment().subtract(1, 'M').format(),
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            },
            status: 'expired'
          },
          {
            title: 'Hair loss prevention',
            expiryDate: moment().add(6, 'M').format(),
            licenceHolder: {
              id: '0ae5d4d5-7400-4462-b9fe-22bdf446792e'
            },
            status: 'active'
          }
        ]
      }, { insertMissing: true, relate: true }));
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('Search', () => {
    it('can search on project title', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Anti cancer research',
        status: 'inactive'
      };
      return Promise.resolve()
        .then(() => this.models.Project.search(opts))
        .then(projects => {
          assert.deepEqual(projects.total, 1);
          assert.deepEqual(projects.results[0].title, 'Anti cancer research');
        });
    });

    it('can search expired projects', () => {
      const opts = {
        establishmentId: 8201,
        search: 'expired research',
        status: 'expired'
      };
      return Promise.resolve()
        .then(() => this.models.Project.search(opts))
        .then(projects => {
          assert.deepEqual(projects.total, 2);
          assert(
            every(projects.results, p => p.title.includes('expired research'))
          );
        });
    });

    it('can search on licenceHolder name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Vincent Malloy',
        status: 'inactive'
      };
      return Promise.resolve()
        .then(() => this.models.Project.search(opts))
        .then(projects => {
          assert.deepEqual(projects.total, 2);
          assert(
            every(projects.results, p => p.licenceHolder.firstName === 'Vincent')
          );
        });
    });
  });

  describe('scoped methods', () => {
    it('exports a scopeToParams method which exposes scoped getAll and getNamed methods', () => {
      const projects = this.models.Project.scopeToParams({});
      assert.ok(projects.getOwn);
      assert.ok(projects.getAll);
    });

    it('exports a scopeSingle method which exposes scoped getAll and getNamed methods', () => {
      const project = this.models.Project.scopeSingle({});
      assert.ok(project.getOwn);
      assert.ok(project.get);
    });

    describe('getOwnProjects', () => {
      it('returns only the users non-expired projects', () => {
        const expectedTitles = [
          'Anti cancer research',
          'Some more research'
        ];
        const notExpectedTitles = [
          'Some expired research',
          'Some more expired research',
          'Hair loss prevention'
        ];
        return Promise.resolve()
          .then(() => this.models.Project.getOwnProjects({
            licenceHolderId: '781d8d17-9c00-4f3d-8734-c1a469426546',
            establishmentId: 8201,
            status: 'inactive'
          }))
          .then(({ projects: { results } }) => {
            assert.deepEqual(results.length, 2);
            expectedTitles.forEach(title => {
              assert.ok(results.find(p => p.title === title));
            });

            notExpectedTitles.forEach(title => {
              assert.deepEqual(results.find(p => p.title === title), null);
            });
          });
      });
    });

    describe('getOwn', () => {
      it('can retrieve own project', () => {
        const licenceHolderId = '781d8d17-9c00-4f3d-8734-c1a469426546';
        const title = 'Anti cancer research';
        return Promise.resolve()
          .then(() => this.models.Project.query().where({ title }))
          .then(projects => projects[0])
          .then(({ id }) => this.models.Project.getOwn({
            licenceHolderId,
            establishmentId: 8201,
            id
          }))
          .then(project => {
            assert.ok(project);
            assert.deepEqual(project.title, title);
          });
      });

      it('cannot retrieve other projects', () => {
        const licenceHolderId = '781d8d17-9c00-4f3d-8734-c1a469426546';
        const title = 'Hair loss prevention';
        return Promise.resolve()
          .then(() => this.models.Project.query().where({ title }))
          .then(projects => projects[0])
          .then(({ id }) => this.models.Project.getOwn({
            licenceHolderId,
            establishmentId: 8201,
            id
          }))
          .then(project => {
            assert.deepEqual(project, null);
          });
      });
    });

    describe('getAll', () => {
      it('returns only submitted drafts to ASRU users', () => {
        const params = {
          establishmentId: 8201,
          status: 'inactive',
          isAsru: true
        };
        return Promise.resolve()
          .then(() => this.models.Project.scopeToParams(params).getAll())
          .then(({ projects }) => {
            assert.equal(projects.results.length, 1);
            assert.equal(projects.results[0].title, 'Some more research', 'Only the project with a submitted version should be returned');
          });
      });
    });
  });
});
