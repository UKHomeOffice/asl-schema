import moment from 'moment';
import assert from 'assert';
import { v4 as uuid } from 'uuid';
import {getSpecies, up} from '../../migrations/20201203162238_migrate_species_from_versions.js';
import Knex from 'knex';
import dbExtra from '../functional/helpers/db.js';

describe('getSpecies', () => {
  it('returns an empty array if data or project are undefined', () => {
    assert.deepEqual(getSpecies(), []);
  });

  describe('legacy', () => {
    it('returns an empty array if no protocols', () => {
      assert.deepEqual(getSpecies({}, { schema_version: 0 }), []);
    });

    it('ignores falsy values', () => {
      const data = {
        protocols: [
          {
            species: [
              {
                foo: 'bar'
              },
              {
                speciesId: '20'
              }
            ]
          }
        ]
      };
      assert.deepEqual(getSpecies(data, { schema_version: 0 }), ['Mice']);
    });

    it('returns an empty array if no species added', () => {
      const data = {
        protocols: [
          {
            some: 'field'
          }
        ]
      };
      assert.deepEqual(getSpecies(data, { schema_version: 0 }), []);
    });

    it('can extract species from legacy style data, ignoring dupes', () => {
      const data = {
        protocols: [
          {
            species: [
              {
                speciesId: '2'
              },
              {
                speciesId: '20'
              },
              {
                speciesId: '2'
              }
            ]
          },
          {
            species: [
              {
                speciesId: '28',
                'other-species-type': 'JABU'
              },
              {
                speciesId: '28',
                'other-species-type': 'BABU'
              }
            ]
          }
        ]
      };

      const expected = [
        'Amphibians',
        'Mice',
        'JABU',
        'BABU'
      ];

      assert.deepEqual(getSpecies(data, { schema_version: 0 }), expected);
    });
  });

  describe('schema version 1', () => {
    it('returns an empty array if no species', () => {
      const data = {
        some: 'fields'
      };
      assert.deepEqual(getSpecies(data, { schema_version: 1 }), []);
    });

    it('can extract species from data ignoring dupes', () => {
      const data = {
        species: ['mice', 'rats', 'mice'],
        'species-other': ['JABU', 'BABU', 'JABU'],
        'species-other-amphibians': ['FROGGY'],
        'species-other-birds': ['Phoenix'],
        'species-other-camelids': ['Humpback'],
        'species-other-dogs': ['Pug'],
        'species-other-domestic-fowl': ['Fried chicken'],
        'species-other-equidae': ['Zebra'],
        'species-other-fish': ['Blobfish'],
        'species-other-nhps': ['Bush baby'],
        'species-other-reptiles': ['Bastard lizard'],
        'species-other-rodents': ['Kangaroo']
      };
      const expected = [
        'Mice',
        'Rats',
        'JABU',
        'BABU',
        'FROGGY',
        'Phoenix',
        'Humpback',
        'Pug',
        'Fried chicken',
        'Zebra',
        'Blobfish',
        'Bush baby',
        'Bastard lizard',
        'Kangaroo'
      ];
      assert.deepEqual(getSpecies(data, { schema_version: 1 }), expected);
    });
  });
});

describe('up', () => {
  // todo: get the config from helper method.
  const knexInstance = Knex({
    client: 'postgres',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'test-password',
      database: 'asl-test'
    }
  });

  const ids = {
    project: {
      activeWithSpecies: uuid(),
      activeNoSpecies: uuid(),
      activeMultipleVersions: uuid(),
      draft: uuid(),
      legacyWithSpecies: uuid(),
      legacyNoSpecies: uuid(),
      legacyWithFalsySpecies: uuid()
    }
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
      id: ids.project.activeWithSpecies,
      title: 'Test project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.project.activeNoSpecies,
      title: 'Test project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.project.activeMultipleVersions,
      title: 'Legacy Project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.project.draft,
      title: 'Test project',
      licence_holder_id: licenceHolder.id,
      status: 'inactive',
      schema_version: 1
    },
    {
      id: ids.project.legacyWithSpecies,
      title: 'Legacy Project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0
    },
    {
      id: ids.project.legacyWithFalsySpecies,
      title: 'Legacy Project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0
    },
    {
      id: ids.project.legacyNoSpecies,
      title: 'Legacy Project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0
    }
  ];

  const versions = [
    {
      project_id: ids.project.activeWithSpecies,
      status: 'granted',
      data: {
        species: ['mice', 'rats'],
        'species-other': ['JABU', 'BABU', 'JABU'],
        'species-other-amphibians': ['FROGGY'],
        'species-other-birds': ['Phoenix'],
        'species-other-camelids': ['Humpback'],
        'species-other-dogs': ['Pug'],
        'species-other-domestic-fowl': ['Fried chicken'],
        'species-other-equidae': ['Zebra'],
        'species-other-fish': ['Blobfish'],
        'species-other-nhps': ['Bush baby'],
        'species-other-reptiles': ['Bastard lizard'],
        'species-other-rodents': ['Kangaroo']
      }
    },
    {
      project_id: ids.project.activeNoSpecies,
      status: 'granted',
      data: {
        foo: 'bar'
      }
    },
    {
      project_id: ids.project.activeMultipleVersions,
      status: 'granted',
      data: {
        species: ['mice']
      },
      created_at: moment().subtract(2, 'weeks').toISOString()
    },
    {
      project_id: ids.project.activeMultipleVersions,
      status: 'granted',
      data: {
        species: ['mice', 'rats']
      },
      created_at: moment().subtract(1, 'week').toISOString()
    },
    {
      project_id: ids.project.activeMultipleVersions,
      status: 'draft',
      data: {
        species: ['mice', 'rats', 'cats']
      },
      created_at: moment().toISOString()
    },
    {
      project_id: ids.project.draft,
      status: 'submitted',
      data: {
        species: ['mice', 'rats', 'cats']
      }
    },
    {
      project_id: ids.project.legacyWithSpecies,
      status: 'granted',
      data: {
        protocols: [
          {
            species: [
              {
                speciesId: '2'
              },
              {
                speciesId: '20'
              }
            ]
          },
          {
            species: [
              {
                speciesId: '28',
                'other-species-type': 'JABU'
              },
              {
                speciesId: '28',
                'other-species-type': 'BABU'
              }
            ]
          }
        ]
      }
    },
    {
      project_id: ids.project.legacyWithFalsySpecies,
      status: 'granted',
      data: {
        protocols: [
          {
            species: [
              {
                foo: 'bar'
              },
              {
                speciesId: '20'
              }
            ]
          }
        ]
      }
    },
    {
      project_id: ids.project.legacyNoSpecies,
      status: 'granted',
      data: {
        foo: 'bar'
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

  it('adds species to project model', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.activeWithSpecies).first())
      .then(project => {
        const expected = [
          'Mice',
          'Rats',
          'JABU',
          'BABU',
          'FROGGY',
          'Phoenix',
          'Humpback',
          'Pug',
          'Fried chicken',
          'Zebra',
          'Blobfish',
          'Bush baby',
          'Bastard lizard',
          'Kangaroo'
        ];

        assert.deepEqual(project.species, expected);
      });
  });

  it('skips projects without species', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.activeNoSpecies).first())
      .then(project => {
        assert.deepEqual(project.species, null);
      });
  });

  it('gets species from latest granted version for active project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.activeMultipleVersions).first())
      .then(project => {
        assert.deepEqual(project.species, ['Mice', 'Rats']);
      });
  });

  it('gets species from latest submitted version for draft project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.draft).first())
      .then(project => {
        assert.deepEqual(project.species, ['Mice', 'Rats', 'Cats']);
      });
  });

  it('adds species from protocols to legacy projects', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.legacyWithSpecies).first())
      .then(project => {
        const expected = [
          'Amphibians',
          'Mice',
          'JABU',
          'BABU'
        ];
        assert.deepEqual(project.species, expected);
      });
  });

  it('adds species from protocols to legacy projects', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.legacyWithFalsySpecies).first())
      .then(project => {
        const expected = ['Mice'];
        assert.deepEqual(project.species, expected);
      });
  });

  it('ignores legacy projects without species', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.project.legacyNoSpecies).first())
      .then(project => {
        assert.deepEqual(project.species, null);
      });
  });
});
