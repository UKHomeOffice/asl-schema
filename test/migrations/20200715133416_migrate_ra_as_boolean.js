const assert = require('assert');
const uuid = require('uuid');
const db = require('./helpers/db');
const { transform, up } = require('../../migrations/20200715133416_migrate_ra_as_boolean');

describe('transform', () => {
  it('returns undefined if not called with data', () => {
    assert.equal(transform(), undefined);
  });

  it('sets retrospectiveAssessment to false if no conditions match', () => {
    const expected = {
      retrospectiveAssessment: false
    };
    assert.deepEqual(transform({}), expected);
  });

  it('doesn\'t alter retrospectiveAssessment if already boolean', () => {
    const input = {
      retrospectiveAssessment: false
    };
    assert.deepEqual(transform(input), input);
  });

  it('doesn\'t alter retrospectiveAssessment if already boolean', () => {
    const input = {
      retrospectiveAssessment: true
    };
    assert.deepEqual(transform(input), input);
  });

  it('handles legacy object structure', () => {
    const input = {
      retrospectiveAssessment: {
        'retrospective-assessment-required': false
      }
    };
    const expected = {
      retrospectiveAssessment: false
    };
    assert.deepEqual(transform(input), expected);
  });

  it('handles legacy object structure', () => {
    const input = {
      retrospectiveAssessment: {
        'retrospective-assessment-required': true
      }
    };
    const expected = {
      retrospectiveAssessment: true
    };
    assert.deepEqual(transform(input), expected);
  });

  it('handles ra as condition', () => {
    const input = {
      conditions: [
        {
          key: 'retrospective-assessment'
        }
      ]
    };
    const expected = {
      conditions: [
        {
          key: 'retrospective-assessment'
        }
      ],
      retrospectiveAssessment: true
    };
    assert.deepEqual(transform(input), expected);
  });
});

describe('up', () => {
  const ids = {
    activeProject: uuid(),
    legacyProject: uuid(),
    noRa: uuid(),
    raTrue: uuid(),
    raFalse: uuid(),
    raAsCondition: uuid(),
    legacyRaTrue: uuid(),
    legacyRaFalse: uuid()
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
      id: ids.activeProject,
      title: 'Active project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.legacyProject,
      title: 'Draft project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0
    }
  ];

  const versions = [
    {
      id: ids.noRa,
      project_id: ids.activeProject,
      data: {
        title: 'No RA'
      }
    },
    {
      id: ids.raFalse,
      project_id: ids.activeProject,
      data: {
        title: 'RA false',
        retrospectiveAssessment: false
      }
    },
    {
      id: ids.raTrue,
      project_id: ids.activeProject,
      data: {
        title: 'RA true',
        retrospectiveAssessment: true
      }
    },
    {
      id: ids.raAsCondition,
      project_id: ids.activeProject,
      data: {
        title: 'RA as condition',
        conditions: [
          {
            key: 'retrospective-assessment'
          }
        ]
      }
    },
    {
      id: ids.legacyRaTrue,
      project_id: ids.legacyProject,
      data: {
        title: 'RA in legacy format - true',
        retrospectiveAssessment: {
          'retrospective-assessment-required': true
        }
      }
    },
    {
      id: ids.legacyRaFalse,
      project_id: ids.legacyProject,
      data: {
        title: 'RA in legacy format - false',
        retrospectiveAssessment: {
          'retrospective-assessment-required': false
        }
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

  it('sets ra to false if no conditions met, and key not present', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where('id', ids.noRa).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where('id', ids.noRa).first())
          .then(version => {
            const expected = {
              ...before.data,
              retrospectiveAssessment: false
            };
            assert.deepEqual(version.data, expected);
          });
      });
  });

  it('leaves RA if defined', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where('id', ids.raFalse).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where('id', ids.raFalse).first())
          .then(version => {
            assert.deepEqual(version.data, before.data);
          });
      });
  });

  it('leaves RA if defined', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where('id', ids.raTrue).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where('id', ids.raTrue).first())
          .then(version => {
            assert.deepEqual(version.data, before.data);
          });
      });
  });

  it('sets ra as true if added as condition', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where('id', ids.raAsCondition).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where('id', ids.raAsCondition).first())
          .then(version => {
            const expected = {
              ...before.data,
              retrospectiveAssessment: true
            };
            assert.deepEqual(version.data, expected);
          });
      });
  });

  it('sets ra as true if legacy ra is true', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where('id', ids.legacyRaTrue).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where('id', ids.legacyRaTrue).first())
          .then(version => {
            const expected = {
              ...before.data,
              retrospectiveAssessment: true
            };
            assert.deepEqual(version.data, expected);
          });
      });
  });

  it('sets ra as true if legacy ra is true', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where('id', ids.legacyRaFalse).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where('id', ids.legacyRaFalse).first())
          .then(version => {
            const expected = {
              ...before.data,
              retrospectiveAssessment: false
            };
            assert.deepEqual(version.data, expected);
          });
      });
  });
});
