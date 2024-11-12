import assert from 'assert';
import { v4 as uuid } from 'uuid';
import {transform, up} from '../../migrations/20200715133416_migrate_ra_as_boolean.js';
import Knex from 'knex';
import dbExtra from '../functional/helpers/db.js';
import { knexSnakeCaseMappers } from 'objection';

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
  const { knexInstance: dbInstance } = dbExtra;

  const knexInstance = Knex({
    ...dbInstance.client.config
  });

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

  let model = null;

  before(async () => {
    model = await dbExtra.init();
  });

  beforeEach(async () => {
    await dbExtra.clean(model);
    try {
      await knexInstance('establishments').insert(establishment);
      await knexInstance('profiles').insert(licenceHolder);
      await knexInstance('projects').insert(projects);
      await knexInstance('project_versions').insert(versions);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  it('sets ra to false if no conditions met, and key not present', () => {
    return Promise.resolve()
      .then(() => knexInstance('project_versions').where('id', ids.noRa).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where('id', ids.noRa).first())
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
      .then(() => knexInstance('project_versions').where('id', ids.raFalse).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where('id', ids.raFalse).first())
          .then(version => {
            assert.deepEqual(version.data, before.data);
          });
      });
  });

  it('leaves RA if defined', () => {
    return Promise.resolve()
      .then(() => knexInstance('project_versions').where('id', ids.raTrue).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where('id', ids.raTrue).first())
          .then(version => {
            assert.deepEqual(version.data, before.data);
          });
      });
  });

  it('sets ra as true if added as condition', () => {
    return Promise.resolve()
      .then(() => knexInstance('project_versions').where('id', ids.raAsCondition).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where('id', ids.raAsCondition).first())
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
      .then(() => knexInstance('project_versions').where('id', ids.legacyRaTrue).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where('id', ids.legacyRaTrue).first())
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
      .then(() => knexInstance('project_versions').where('id', ids.legacyRaFalse).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(knexInstance))
          .then(() => knexInstance('project_versions').where('id', ids.legacyRaFalse).first())
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
