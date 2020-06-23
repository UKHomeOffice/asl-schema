const assert = require('assert');
const uuid = require('uuid/v4');
const db = require('./helpers/db');

describe('Place model', () => {
  const nacwo1 = uuid();
  const nacwo2 = uuid();
  const nacwoRoleId1 = uuid();
  const nacwoRoleId2 = uuid();
  const placeId1 = uuid();
  const nvsId = uuid();
  const nvsRoleId = uuid();
  const sqpId = uuid();
  const sqpRoleId = uuid();

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.Establishment.query().insertGraph([
        {
          id: 8201,
          name: 'An establishment',
          email: 'an@establishment.com',
          country: 'england',
          address: '123 Somwhere street',
          profiles: [{
            id: nacwo1,
            firstName: 'Vincent',
            lastName: 'Malloy',
            email: 'vincent@price.com'
          }, {
            id: nacwo2,
            firstName: 'Sterling',
            lastName: 'Archer',
            email: 'sterline@archer.com'
          }, {
            id: nvsId,
            firstName: 'Real',
            lastName: 'Vet',
            email: 'real-vet@example.com'
          }, {
            id: sqpId,
            firstName: 'Fake',
            lastName: 'Vet',
            email: 'not-a-real-vet@example.com'
          }],
          roles: [{
            id: nacwoRoleId1,
            type: 'nacwo',
            profileId: nacwo1
          }, {
            id: nacwoRoleId2,
            type: 'nacwo',
            profileId: nacwo2
          }, {
            id: sqpRoleId,
            type: 'sqp',
            profileId: sqpId
          }, {
            id: nvsRoleId,
            type: 'nvs',
            profileId: nvsId
          }]
        },
        {
          id: 8202,
          name: 'Another establishment',
          email: 'another@establishment.com',
          address: '123 Another street',
          country: 'wales',
          places: [
            {
              site: 'A site',
              name: 'A name',
              suitability: ['NHP'],
              holding: ['NOH']
            }
          ]
        }
      ]))
      .then(() => this.models.Place.query().insertGraph([
        {
          id: placeId1,
          site: 'A site',
          name: 'A name',
          suitability: ['SA', 'LA'],
          holding: ['NOH', 'NSEP'],
          establishmentId: 8201,
          roles: [
            {
              type: 'nacwo',
              id: nacwoRoleId1
            },
            {
              type: 'sqp',
              id: sqpRoleId
            }
          ]
        },
        {
          id: uuid(),
          site: 'B site',
          name: 'B name',
          suitability: ['SA'],
          holding: ['NOH'],
          establishmentId: 8201,
          roles: [
            {
              type: 'nacwo',
              id: nacwoRoleId1
            },
            {
              type: 'nvs',
              id: nvsRoleId
            },
            {
              type: 'sqp',
              id: sqpRoleId
            }
          ]
        },
        {
          id: uuid(),
          site: 'C site',
          name: 'C name',
          suitability: ['LA', 'DOG'],
          holding: ['SEP'],
          establishmentId: 8201,
          roles: [
            {
              type: 'sqp',
              id: sqpRoleId
            },
            {
              type: 'nacwo',
              id: nacwoRoleId2
            }
          ]
        },
        {
          id: uuid(),
          site: 'D site',
          name: 'D name',
          suitability: ['AQ', 'AV'],
          holding: ['NSEP'],
          establishmentId: 8201,
          roles: {
            type: 'nacwo',
            id: nacwoRoleId2
          }
        }
      ],
      { relate: true }));
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('getFilterOptions', () => {
    it('returns a map of unique sites, holding codes, suitability codes and roles', () => {
      return Promise.resolve()
        .then(() => this.models.Place.getFilterOptions(8201))
        .then(filters => {
          assert.deepEqual(filters.map(f => ({ ...f, values: f.values.sort() })), [{
            key: 'site',
            values: ['A site', 'B site', 'C site', 'D site'].sort()
          }, {
            key: 'suitability',
            values: ['SA', 'AQ', 'AV', 'LA', 'DOG'].sort()
          }, {
            key: 'holding',
            values: ['NOH', 'NSEP', 'SEP'].sort()
          }, {
            key: 'nacwos',
            values: [
              {
                label: 'Sterling Archer',
                value: nacwoRoleId2
              },
              {
                label: 'Vincent Malloy',
                value: nacwoRoleId1
              }
            ]
          }, {
            key: 'nvssqps',
            values: [
              {
                label: 'Fake Vet',
                value: sqpRoleId
              },
              {
                label: 'Real Vet',
                value: nvsRoleId
              }
            ]
          }]);
        });
    });

    it('returns a map of unique sites, holding codes, suitability codes and roles', () => {
      return Promise.resolve()
        .then(() => this.models.Place.getFilterOptions(8202))
        .then(filters => {
          assert.deepEqual(filters, [{
            key: 'site',
            values: ['A site']
          }, {
            key: 'suitability',
            values: ['NHP']
          }, {
            key: 'holding',
            values: ['NOH']
          }, {
            key: 'nacwos',
            values: []
          }, {
            key: 'nvssqps',
            values: []
          }]);
        });
    });
  });

  describe('filter', () => {
    it('filters by site', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          site: ['A site']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 1);
          assert.deepEqual(places.results[0].site, 'A site');
        });
    });

    it('filters by holding', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          holding: ['NSEP', 'NOH']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 1);
          assert.deepEqual(places.results[0].site, 'A site');
        });
    });

    it('filters by suitability', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          suitability: ['LA']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 2);
        });
    });

    it('filters by combined fields', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          holding: ['SEP'],
          suitability: ['LA']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 1);
          assert.deepEqual(places.results[0].site, 'C site');
        });
    });

    it('filters by a single nacwo', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          nacwos: [nacwoRoleId1]
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          const expected = [
            'A name',
            'B name'
          ];
          assert.equal(places.total, expected.length);
          assert.deepEqual(places.results.map(p => p.name), expected);
        });
    });

    it('filters by a single nvs', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          nvssqps: [nvsRoleId]
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          const expected = [
            'B name'
          ];
          assert.equal(places.total, expected.length);
          assert.deepEqual(places.results.map(p => p.name), expected);
        });
    });

    it('filters by a multiple nvs/sqp roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          nvssqps: [nvsRoleId, sqpRoleId]
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          const expected = [
            'A name',
            'B name',
            'C name'
          ];
          assert.equal(places.total, expected.length);
          assert.deepEqual(places.results.map(p => p.name), expected);
        });
    });

    it('filters by a multiple nvs/sqp roles and nacwos', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          nvssqps: [nvsRoleId, sqpRoleId],
          nacwos: [nacwoRoleId1]
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          const expected = [
            'A name',
            'B name'
          ];
          assert.equal(places.total, expected.length);
          assert.deepEqual(places.results.map(p => p.name), expected);
        });
    });

    it('paginates results', () => {
      const opts = {
        establishmentId: 8201,
        limit: 2,
        offset: 1
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 4);
          assert.deepEqual(places.results.length, 2);
          assert.deepEqual(places.results[0].site, 'B site');
          assert.deepEqual(places.results[1].site, 'C site');
        });
    });

    it('doesn\'t paginate results if limit is set to all', () => {
      const opts = {
        establishmentId: 8201,
        limit: 'all'
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 4);
          assert.deepEqual(places.results.length, 4);
        });
    });

    it('sorts results', () => {
      const opts = {
        establishmentId: 8201,
        sort: {
          column: 'site',
          ascending: 'false'
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 4);
          assert.deepEqual(places.results.length, 4);
          assert.deepEqual(places.results[0].site, 'D site');
          assert.deepEqual(places.results[1].site, 'C site');
          assert.deepEqual(places.results[2].site, 'B site');
          assert.deepEqual(places.results[3].site, 'A site');
        });
    });

    it('eager loads associated roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          suitability: ['LA'],
          holding: ['SEP']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 1);
          const nacwos = places.results[0].roles.filter(r => r.type === 'nacwo');
          assert.deepEqual(nacwos[0].profile.firstName, 'Sterling');
        });
    });
  });

  describe('Uniqueness constraints', () => {
    it('prevents the same role being assigned to the same place more than once', () => {
      assert.rejects(async () => this.models.PlaceRole.query().insert({
        placeId: placeId1,
        roleId: nacwoRoleId1 // relation already exists
      }));
    });

    it('allows multiple soft-deleted same role at same place to exist', () => {
      return assert.ok(async () => this.models.PlaceRole.query().insert([
        {
          placeId: placeId1,
          roleId: nacwoRoleId1,
          deleted: new Date('2020-05-13 10:00:00').toISOString()
        },
        {
          placeId: placeId1,
          roleId: nacwoRoleId1,
          deleted: new Date('2020-05-13 11:00:00').toISOString()
        },
        {
          placeId: placeId1,
          roleId: nacwoRoleId1,
          deleted: new Date('2020-05-13 102:00:00').toISOString()
        }
      ]));
    });
  });
});
