const uuid = require('uuid/v4');
const assert = require('assert');
const isUuid = require('uuid-validate');
const db = require('./helpers/db');
const diff = require('deep-diff');

const { up, transform } = require('../../migrations/20200501141527_assign_ids_to_continuation');

describe('transform', () => {
  it('returns undefined if called without data', () => {
    assert.equal(transform(), undefined);
  });

  it('returns undefined if project-continuation missing', () => {
    const before = {
      field: 'value'
    };
    assert.equal(transform(before), undefined);
  });

  it('returns undefined if project-continuation not an array', () => {
    const before = {
      'project-continuation': true
    };
    assert.equal(transform(before), undefined);
  });

  it('assigns uuids to each continuation item missing an id', () => {
    const before = {
      'project-continuation': [
        {
          id: uuid(),
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        },
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        },
        {
          'licence-number': null,
          'expiry-date': null
        }
      ]
    };

    const after = transform(before);

    assert.ok(after['project-continuation'].every(item => isUuid(item.id)));
  });

});

describe('up', () => {
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

  const ids = {
    legacyProject: uuid(),
    activeProject: uuid(),
    legacyVersion: uuid(),
    noContinuation: uuid(),
    missingContinuationIds: uuid()
  }

  const projects = [
    {
      id: ids.legacyProject,
      title: 'Legacy',
      schema_version: 0,
      licence_holder_id: licenceHolder.id
    },
    {
      id: ids.activeProject,
      title: 'Continuation',
      schema_version: 1,
      status: 'active',
      licence_holder_id: licenceHolder.id
    }
  ];

  const projectVersions = [
    {
      id: ids.legacyVersion,
      project_id: ids.legacyProject,
      data: {
        title: 'Legacy version',
      }
    },
    {
      id: ids.noContinuation,
      project_id: ids.activeProject,
      data: {
        title: 'No continuation'
      }
    },
    {
      id: ids.missingContinuationIds,
      project_id: ids.activeProject,
      data: {
        title: 'Missing continuations ids',
        'project-continuation': [
          {
            id: uuid(),
            'licence-number': '70/1234',
            'expiry-date': '2020-06-30'
          },
          {
            'licence-number': '70/1234',
            'expiry-date': '2020-06-30'
          },
          {
            'licence-number': null,
            'expiry-date': null
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
      .then(() => this.knex('project_versions').insert(projectVersions));
  });

  it('doesn\'t touch legacy versions', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.legacyVersion }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.legacyVersion }).first())
          .then(after => {
            assert.deepEqual(before, after);
          });
      });
  });

  it('doesn\'t touch non continuations', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.noContinuation }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.noContinuation }).first())
          .then(after => {
            assert.deepEqual(before, after);
          });
      });
  });

  it('assigns ids where missing', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.missingContinuationIds }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.missingContinuationIds }).first())
          .then(after => {
            const changes = diff(before.data, after.data);
            assert.ok(changes.every(change => {
              return change.kind === 'N' && change.path.pop() === 'id';
            }));
          });
      });
  });
});
