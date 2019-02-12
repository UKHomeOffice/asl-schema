const assert = require('assert');
const db = require('./helpers/db');

const PARENT_ID = '06271be3-df1a-41c7-82ac-e9c42cbb1c19';

describe('ProjectVersion model', () => {

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.ProjectVersion.query().upsertGraph([
        {
          id: PARENT_ID,
          data: {
            title: 'A title'
          },
          children: [
            {
              data: {
                title: 'B title'
              }
            },
            {
              data: {
                title: 'C title'
              }
            }
          ]
        }
      ], { insertMissing: true, relate: true }))
      .then(() => this.models.ProjectVersion.query());
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('Get', () => {
    it('eager loads children', () => {
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.get(PARENT_ID))
        .then(project => {
          assert.deepEqual(project.children.length, 2);
        });
    });

    it('eager loads parent', () => {
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().whereJsonSupersetOf('data', { title: 'B title' }))
        .then(projects => projects[0])
        .then(project => this.models.ProjectVersion.get(project.id))
        .then(project => {
          assert.deepEqual(project.parent.id, PARENT_ID);
        })
        .then(() => this.models.ProjectVersion.query().whereJsonSupersetOf('data', { title: 'C title' }))
        .then(projects => projects[0])
        .then(project => this.models.ProjectVersion.get(project.id))
        .then(project => {
          assert.deepEqual(project.parent.id, PARENT_ID);
        });
    });
  });

});
