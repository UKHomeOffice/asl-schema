const assert = require('assert');
const uuid = require('uuid/v4');
const { cloneDeep, omit } = require('lodash');
const diff = require('deep-diff');
const db = require('./helpers/db');
const { transform, up } = require('../../migrations/20200406154728_migrate_fate_of_animals_killed');

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

  const ids = {
    active: uuid(),
    draft: uuid(),
    legacy: uuid()
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
      title: 'Project with granted versions',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.draft,
      title: 'Project draft',
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
    }
  ];

  const versions = [
    {
      project_id: ids.legacy,
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
      project_id: ids.active,
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
      project_id: ids.active,
      status: 'granted',
      data: {
        title: 'should add killed, fate undefined',
        'fate-of-animals-nts': false
      }
    },
    {
      project_id: ids.active,
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
      project_id: ids.active,
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
      project_id: ids.draft,
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

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('establishments').insert(establishment))
      .then(() => this.knex('profiles').insert(licenceHolder))
      .then(() => this.knex('projects').insert(projects))
      .then(() => this.knex('project_versions').insert(versions))
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

  it('doesn\'t touch legacy versions', () => {
    return Promise.resolve()
      .then(() => {
        return this.knex('project_versions')
          .where('project_id', ids.legacy)
      })
      .then(before => {
        return Promise.resolve()
          .then(() => {
            return up(this.knex);
          })
          .then(() => {
            return this.knex('project_versions')
              .where('project_id', ids.legacy)
          })
          .then(after => {
            assert.deepEqual(before, after);
          });
      });
  });

  it('updates draft versions', () => {
    return Promise.resolve()
      .then(() => {
        return up(this.knex);
      })
      .then(() => {
        return this.knex('project_versions')
          .where('project_id', ids.draft)
          .first()
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
        return this.knex('project_versions')
          .where('project_id', ids.active)
      })
      .then(before => {
        return Promise.resolve()
          .then(() => {
            return up(this.knex);
          })
          .then(() => {
            return this.knex('project_versions')
              .where('project_id', ids.active)
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
