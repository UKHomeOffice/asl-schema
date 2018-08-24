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
            expiryDate: moment().add(1, 'M').format(),
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            }
          },
          {
            title: 'Some expired research',
            expiryDate: moment().subtract(6, 'M').format(),
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            }
          },
          {
            title: 'Some more research',
            expiryDate: moment().add(6, 'M').format(),
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            }
          },
          {
            title: 'Some more expired research',
            expiryDate: moment().subtract(1, 'M').format(),
            licenceHolder: {
              id: '781d8d17-9c00-4f3d-8734-c1a469426546'
            }
          },
          {
            title: 'Hair loss prevention',
            expiryDate: moment().add(6, 'M').format(),
            licenceHolder: {
              id: '0ae5d4d5-7400-4462-b9fe-22bdf446792e'
            }
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
        search: 'Anti cancer research'
      };
      return Promise.resolve()
        .then(() => this.models.Project.search(opts))
        .then(projects => {
          assert.deepEqual(projects.total, 1);
          assert.deepEqual(projects.results[0].title, 'Anti cancer research');
        });
    });

    it('omits expired projects', () => {
      const opts = {
        establishmentId: 8201,
        search: 'expired research'
      };
      return Promise.resolve()
        .then(() => this.models.Project.search(opts))
        .then(projects => {
          assert.deepEqual(projects.total, 0);
        });
    });

    it('can search on licenceHolder name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Vincent Malloy'
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
});
