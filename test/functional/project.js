const uuid = require('uuid/v4');
const { every } = require('lodash');
const assert = require('assert');
const db = require('./helpers/db');
const moment = require('moment');

const ids = {
  collaborator: uuid(),
  collaborationProject: uuid(),
  draftProject: uuid(),
  draftProjectVersion: uuid(),
  submittedDraft: uuid(),
  vincentMalloy: uuid(),
  sterlingArcher: uuid(),
  ropsUser: uuid(),
  establishmentId: 8201,
  additionalEstablishment: 8202,
  anotherEstablishment: 8203,
  additionalProject: uuid(),
  additionalVersion: uuid(),
  draftAdditionalProject: uuid(),
  draftAdditionalVersion: uuid(),
  transferIn: uuid(),
  transferOut: uuid()
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
        },
        {
          id: ids.ropsUser,
          firstName: 'Rops',
          lastName: 'User',
          email: 'rops@example.com'
        }
      ]))
      .then(() => this.models.Establishment.query().insert([
        {
          id: ids.establishmentId,
          name: 'An establishment'
        },
        {
          id: ids.additionalEstablishment,
          name: 'Additional establishment'
        },
        {
          id: ids.anotherEstablishment,
          name: 'Another establishment'
        }
      ]))
      .then(() => this.models.Project.query().insert([
        {
          id: ids.draftProject,
          establishmentId: ids.establishmentId,
          title: 'Draft project',
          licenceHolderId: ids.vincentMalloy,
          status: 'inactive'
        },
        {
          id: uuid(),
          establishmentId: ids.establishmentId,
          title: 'Some expired research',
          issueDate: moment().subtract(66, 'M').format(),
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
          issueDate: moment().subtract(61, 'M').format(),
          expiryDate: moment().subtract(1, 'M').format(),
          licenceHolderId: ids.vincentMalloy,
          status: 'expired'
        },
        {
          id: uuid(),
          establishmentId: ids.establishmentId,
          title: 'Hair loss prevention',
          issueDate: moment().subtract(54, 'M').format(),
          expiryDate: moment().add(6, 'M').format(),
          licenceHolderId: ids.sterlingArcher,
          status: 'active'
        },
        {
          id: ids.collaborationProject,
          establishmentId: ids.establishmentId,
          title: 'Collaboration',
          issueDate: moment().subtract(54, 'M').format(),
          expiryDate: moment().add(6, 'M').format(),
          licenceHolderId: ids.sterlingArcher,
          status: 'active'
        },
        {
          id: ids.additionalProject,
          establishmentId: ids.establishmentId,
          title: 'Additional availability',
          issueDate: moment().subtract(54, 'M').format(),
          expiryDate: moment().add(6, 'M').format(),
          licenceHolderId: ids.sterlingArcher,
          status: 'active'
        },
        {
          id: ids.draftAdditionalProject,
          establishmentId: ids.additionalEstablishment,
          title: 'Draft additional availability',
          issueDate: moment().subtract(54, 'M').format(),
          expiryDate: moment().add(6, 'M').format(),
          licenceHolderId: ids.sterlingArcher,
          status: 'active'
        },
        {
          id: uuid(),
          establishmentId: ids.anotherEstablishment,
          title: 'Revoked ROPs test',
          licenceHolderId: ids.ropsUser,
          status: 'revoked',
          issueDate: '2018-01-10T12:00:00.000Z',
          expiryDate: '2023-01-10T12:00:00.000Z',
          revocationDate: '2022-01-10T12:00:00.000Z'
        },
        {
          id: uuid(),
          establishmentId: ids.anotherEstablishment,
          title: 'Expired ROPs test',
          licenceHolderId: ids.ropsUser,
          status: 'expired',
          issueDate: '2017-01-10T12:00:00.000Z',
          expiryDate: '2022-01-10T12:00:00.000Z'
        },
        {
          id: uuid(),
          establishmentId: ids.anotherEstablishment,
          title: 'Active ROPs test',
          licenceHolderId: ids.ropsUser,
          status: 'active',
          issueDate: '2017-07-10T12:00:00.000Z',
          expiryDate: '2022-07-10T12:00:00.000Z'
        },
        {
          id: ids.transferOut,
          establishmentId: ids.establishmentId,
          title: 'Transferred project',
          licenceHolderId: ids.ropsUser,
          status: 'transferred',
          issueDate: '2019-07-10T12:00:00.000Z',
          expiryDate: '2024-07-10T12:00:00.000Z',
          transferredOutDate: '2021-07-10T12:00:00.000Z',
          transferEstablishmentId: ids.anotherEstablishment,
          transferProjectId: ids.transferIn
        },
        {
          id: ids.transferIn,
          establishmentId: ids.anotherEstablishment,
          title: 'Transferred project',
          licenceHolderId: ids.ropsUser,
          status: 'active',
          issueDate: '2019-07-10T12:00:00.000Z',
          expiryDate: '2024-07-10T12:00:00.000Z',
          transferredInDate: '2021-07-10T12:00:00.000Z',
          previousProjectId: ids.transferOut,
          previousEstablishmentId: ids.establishmentId
        }
      ]))
      .then(() => this.models.ProjectVersion.query().insert([
        {
          id: ids.draftProjectVersion,
          projectId: ids.draftProject,
          status: 'draft'
        },
        {
          id: uuid(),
          projectId: ids.submittedDraft,
          status: 'submitted'
        },
        {
          id: ids.additionalVersion,
          projectId: ids.additionalProject,
          status: 'granted'
        },
        {
          id: ids.draftAdditionalVersion,
          projectId: ids.draftAdditionalProject,
          status: 'draft'
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
        'Draft project',
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
        search: 'Draft project',
        status: 'inactive'
      };
      return Promise.resolve()
        .then(() => this.models.Project.search(opts))
        .then(projects => {
          assert.deepEqual(projects.total, 1);
          assert.deepEqual(projects.results[0].title, 'Draft project');
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

    it('includes aa in results', () => {
      const opts = {
        establishmentId: 8201,
        status: 'active',
        search: 'Additional availability'
      };

      const projEst = {
        projectId: ids.additionalProject,
        establishmentId: ids.additionalEstablishment,
        status: 'active',
        versionId: ids.additionalVersion
      };

      return Promise.resolve()
        .then(() => this.models.ProjectEstablishment.query().insert(projEst))
        .then(() => this.models.Project.search(opts))
        .then(results => results.results[0])
        .then(project => {
          const expected = [{
            id: ids.additionalEstablishment,
            name: 'Additional establishment',
            status: 'active'
          }];

          assert.deepEqual(project.additionalEstablishments, expected);
        });
    });

    it('does not include draft aa for active projects', () => {
      const opts = {
        establishmentId: 8201,
        status: 'active',
        search: 'Additional availability'
      };

      const projEst = {
        projectId: ids.additionalProject,
        establishmentId: ids.additionalEstablishment,
        status: 'draft',
        versionId: ids.additionalVersion
      };

      return Promise.resolve()
        .then(() => this.models.ProjectEstablishment.query().insert(projEst))
        .then(() => this.models.Project.search(opts))
        .then(results => results.results[0])
        .then(project => {
          const expected = [];
          assert.deepEqual(project.additionalEstablishments, expected);
        });
    });

    it('includes removed aa for active projects', () => {
      const opts = {
        establishmentId: ids.establishmentId,
        status: 'active',
        search: 'Additional availability'
      };

      const projEst = {
        projectId: ids.additionalProject,
        establishmentId: ids.additionalEstablishment,
        status: 'removed',
        versionId: ids.additionalVersion
      };

      return Promise.resolve()
        .then(() => this.models.ProjectEstablishment.query().insert(projEst))
        .then(() => this.models.Project.search(opts))
        .then(results => results.results[0])
        .then(project => {
          assert.equal(project.additionalEstablishments.length, 1);
          assert.equal(project.additionalEstablishments[0].id, ids.additionalEstablishment);
          assert.equal(project.additionalEstablishments[0].status, 'removed');
        });
    });

    it('includes removed aa for active projects when searching from the removed establishment', () => {
      const opts = {
        establishmentId: ids.additionalEstablishment,
        status: 'active',
        search: 'Additional availability',
        // add a sort so that the first project is not `Draft additional availability`
        sort: {
          column: 'title',
          ascending: 'true'
        }
      };

      const projEst = {
        projectId: ids.additionalProject,
        establishmentId: ids.additionalEstablishment,
        status: 'removed',
        versionId: ids.additionalVersion
      };

      return Promise.resolve()
        .then(() => this.models.ProjectEstablishment.query().insert(projEst))
        .then(() => this.models.Project.search(opts))
        .then(results => results.results[0])
        .then(project => {
          assert.equal(project.additionalEstablishments.length, 1);
          assert.equal(project.additionalEstablishments[0].id, ids.additionalEstablishment);
          assert.equal(project.additionalEstablishments[0].status, 'removed');
        });
    });

    it('includes draft aa for draft projects', () => {
      const opts = {
        establishmentId: 8201,
        status: 'inactive',
        search: 'draft project'
      };

      const projEst = {
        projectId: ids.draftProject,
        establishmentId: ids.additionalEstablishment,
        status: 'draft',
        versionId: ids.draftProjectVersion
      };

      return Promise.resolve()
        .then(() => this.models.ProjectEstablishment.query().insert(projEst))
        .then(() => this.models.Project.search(opts))
        .then(results => results.results[0])
        .then(project => {
          const expected = [{
            id: ids.additionalEstablishment,
            name: 'Additional establishment',
            status: 'draft'
          }];
          assert.deepEqual(project.additionalEstablishments, expected);
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
          'Draft project',
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
        const title = 'Draft project';
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

    // regression
    it('eager loads deleted project when loading a version with queryWithDeleted', () => {
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().findById(ids.draftProjectVersion).delete())
        .then(() => this.models.Project.query().findById(ids.draftProject).delete())
        .then(() => this.models.ProjectVersion.queryWithDeleted().findById(ids.draftProjectVersion).withGraphFetched('project'))
        .then(version => {
          assert.ok(version.deleted, 'should fetch deleted version');
          assert.ok(version.project, 'should get linked project');
          assert.ok(version.project.deleted, 'linked project should be deleted');
        });
    });
  });

  describe('whereHasAvailability', () => {

    beforeEach(() => {
      return Promise.resolve()
        .then(() => {
          // add an additional availability record
          return this.models.ProjectEstablishment.query().insert([
            {
              projectId: ids.draftProject,
              establishmentId: ids.additionalEstablishment,
              status: 'draft',
              versionId: ids.draftProjectVersion
            },
            {
              projectId: ids.additionalProject,
              establishmentId: ids.additionalEstablishment,
              status: 'active',
              versionId: ids.additionalVersion
            },
            {
              projectId: ids.draftAdditionalProject,
              establishmentId: ids.establishmentId,
              status: 'draft',
              versionId: ids.draftAdditionalVersion
            }
          ]);
        });
    });

    it('returns projects with active additional availability', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereHasAvailability(ids.additionalEstablishment))
        .then(projects => {
          assert.equal(projects.length, 3);
          const titles = projects.map(p => p.title);
          ['Additional availability']
            .forEach(title => {
              assert.ok(titles.includes(title), `${titles} should include ${title}`);
            });
        });
    });

    it('returns inactive projects with draft additional availability', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereHasAvailability(ids.additionalEstablishment))
        .then(projects => {
          assert.equal(projects.length, 3);
          const titles = projects.map(p => p.title);
          ['Draft project']
            .forEach(title => {
              assert.ok(titles.includes(title), `${titles} should include ${title}`);
            });
        });
    });

    it('does not include draft additional availability on active projects', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereHasAvailability(ids.establishmentId))
        .then(projects => {
          const titles = projects.map(p => p.title);
          ['Draft additional availability']
            .forEach(title => {
              assert.ok(!titles.includes(title), `${titles} should not include ${title}`);
            });
        });
    });

    it('returns own projects', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereHasAvailability(ids.establishmentId))
        .then(projects => {
          assert.equal(projects.length, 8);
        });
    });

  });

  describe('whereRopsDue', () => {

    it('does not include projects transferred in after the end of the year', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereRopsDue(2020))
        .then(projects => {
          return projects.map(project => project.id);
        })
        .then(projectIds => {
          assert.ok(!projectIds.includes(ids.transferIn));
        });
    });

    it('does include projects transferred in during the year', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereRopsDue(2021))
        .then(projects => {
          return projects.map(project => project.id);
        })
        .then(projectIds => {
          assert.ok(projectIds.includes(ids.transferIn));
        });
    });

    it('does include projects transferred out after the end of the year', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereRopsDue(2020))
        .then(projects => {
          return projects.map(project => project.id);
        })
        .then(projectIds => {
          assert.ok(projectIds.includes(ids.transferOut));
        });
    });

    it('does not include projects transferred out during the year', () => {
      return Promise.resolve()
        .then(() => this.models.Project.query().whereRopsDue(2021))
        .then(projects => {
          return projects.map(project => project.id);
        })
        .then(projectIds => {
          assert.ok(!projectIds.includes(ids.transferOut));
        });
    });

  });

  describe('selectRopsDeadline', () => {

    describe('active project', () => {

      it('returns a ROPs due date of 31st Jan if the project is active at the end of the year', () => {
        return Promise.resolve()
          .then(() => this.models.Project.query().selectRopsDeadline(2021).where({ title: 'Active ROPs test' }).first())
          .then(project => {
            assert.equal(project.ropsDeadline, '2022-01-31T23:59:59.999Z');
          });
      });

      it('returns a ROPs due date of expiry + 28 days if the project is going to expire during the year', () => {
        return Promise.resolve()
          .then(() => this.models.Project.query().selectRopsDeadline(2022).where({ title: 'Active ROPs test' }).first())
          .then(project => {
            assert.equal(project.ropsDeadline, '2022-08-07T23:59:59.999Z');
          });
      });

    });

    describe('expired project', () => {

      it('returns a ROPs due date of 31st Jan if the project expired after the end of the year', () => {
        return Promise.resolve()
          .then(() => this.models.Project.query().selectRopsDeadline(2021).where({ title: 'Expired ROPs test' }).first())
          .then(project => {
            assert.equal(project.ropsDeadline, '2022-01-31T23:59:59.999Z');
          });
      });

      it('returns a ROPs due date of expiry + 28 days if the project expired during the year', () => {
        return Promise.resolve()
          .then(() => this.models.Project.query().selectRopsDeadline(2022).where({ title: 'Expired ROPs test' }).first())
          .then(project => {
            assert.equal(project.ropsDeadline, '2022-02-07T23:59:59.999Z');
          });
      });

    });

    describe('revoked project', () => {

      it('returns a ROPs due date of 31st Jan if the project was revoked after the end of the year', () => {
        return Promise.resolve()
          .then(() => this.models.Project.query().selectRopsDeadline(2021).where({ title: 'Revoked ROPs test' }).first())
          .then(project => {
            assert.equal(project.ropsDeadline, '2022-01-31T23:59:59.999Z');
          });
      });

      it('returns a ROPs due date of revocation + 28 days if the project was revoked during the year', () => {
        return Promise.resolve()
          .then(() => this.models.Project.query().selectRopsDeadline(2022).where({ title: 'Revoked ROPs test' }).first())
          .then(project => {
            assert.equal(project.ropsDeadline, '2022-02-07T23:59:59.999Z');
          });
      });

    });

  });
});
