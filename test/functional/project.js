const uuid = require('uuid/v4');
const { every } = require('lodash');
const assert = require('assert');
const db = require('./helpers/db');
const moment = require('moment');

const ids = {
  collaborator: uuid(),
  collaborationProject: uuid(),
  draftProject: uuid(),
  submittedDraft: uuid(),
  vincentMalloy: uuid(),
  sterlingArcher: uuid(),
  establishmentId: 8201
};

describe('Project model', () => {

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.Profile.query().insert([
        {
          id: ids.vincentMalloy,
          firstName: 'Vincent',
          lastName: 'Malloy',
          email: 'vincent@price.com'
        },
        {
          id: ids.sterlingArcher,
          firstName: 'Sterling',
          lastName: 'Archer',
          email: 'sterling@archer.com'
        },
        {
          id: ids.collaborator,
          firstName: 'Basic',
          lastName: 'User',
          email: 'basicuser@example.com'
        }
      ]))
      .then(() => this.models.Establishment.query().insert({
        id: ids.establishmentId,
        name: 'An establishment',
        email: 'an@establishment.com',
        country: 'england',
        address: '123 Somwhere street'
      }))
      .then(() => this.models.Project.query().insert([
        {
          id: ids.draftProject,
          establishmentId: ids.establishmentId,
          title: 'Anti cancer research',
          licenceHolderId: ids.vincentMalloy,
          status: 'inactive'
        },
        {
          id: uuid(),
          establishmentId: ids.establishmentId,
          title: 'Some expired research',
          expiryDate: moment().subtract(6, 'M').format(),
          licenceHolderId: ids.vincentMalloy,
          status: 'expired'
        },
        {
          id: ids.submittedDraft,
          establishmentId: ids.establishmentId,
          title: 'Some more research',
          licenceHolderId: ids.vincentMalloy,
          status: 'inactive'
        },
        {
          id: uuid(),
          establishmentId: ids.establishmentId,
          title: 'Some more expired research',
          expiryDate: moment().subtract(1, 'M').format(),
          licenceHolderId: ids.vincentMalloy,
          status: 'expired'
        },
        {
          id: uuid(),
          establishmentId: ids.establishmentId,
          title: 'Hair loss prevention',
          expiryDate: moment().add(6, 'M').format(),
          licenceHolderId: ids.sterlingArcher,
          status: 'active'
        },
        {
          id: ids.collaborationProject,
          establishmentId: ids.establishmentId,
          title: 'Collaboration',
          expiryDate: moment().add(6, 'M').format(),
          licenceHolderId: ids.sterlingArcher,
          status: 'active'
        }
      ]))
      .then(() => this.models.ProjectVersion.query().insert([
        {
          projectId: ids.draftProject,
          status: 'draft'
        },
        {
          projectId: ids.submittedDraft,
          status: 'submitted'
        }
      ]))
      .then(() => {
        return this.models.ProjectProfile.query().insert({
          profileId: ids.collaborator,
          projectId: ids.collaborationProject
        });
      });
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('whereIsCollaborator', () => {
    it('returns projects where provided profileId is a collaborator', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereIsCollaborator(ids.collaborator))
        .then(projects => {
          assert.equal(projects.length, 1);
          assert.equal(projects[0].title, 'Collaboration');
        });
    });

    it('returns projects where provided profileId is the licenceHolder', () => {
      const expectedTitles = [
        'Anti cancer research',
        'Some expired research',
        'Some more research',
        'Some more expired research'
      ];
      return Promise.resolve()
        .then(() => this.models.Project.query().whereIsCollaborator(ids.vincentMalloy))
        .then(projects => {
          assert.equal(projects.length, 4);
          expectedTitles.forEach(title => {
            assert.ok(projects.find(p => p.title === title));
          });
        });
    });
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
            licenceHolderId: ids.vincentMalloy,
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

      it('returns project where the provided profile id is a collaborator', () => {
        return Promise.resolve()
          .then(() => this.models.Project.getOwnProjects({
            licenceHolderId: ids.collaborator,
            establishmentId: 8201,
            status: 'active'
          }))
          .then(({ projects: { results } }) => {
            assert.ok(results.length, 1);
          });
      });
    });

    describe('getOwn', () => {
      it('can retrieve own project', () => {
        const licenceHolderId = ids.vincentMalloy;
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
        const licenceHolderId = ids.vincentMalloy;
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
