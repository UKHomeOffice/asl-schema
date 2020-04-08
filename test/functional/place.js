const assert = require('assert');
const uuid = require('uuid/v4');
const db = require('./helpers/db');

describe('Place model', () => {

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    const nacwo1 = uuid();
    const nacwo2 = uuid();
    const nacwoRoleId1 = uuid();
    const nacwoRoleId2 = uuid();
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
          }],
          roles: [{
            id: nacwoRoleId1,
            type: 'nacwo',
            profileId: nacwo1
          }, {
            id: nacwoRoleId2,
            type: 'nacwo',
            profileId: nacwo2
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
      .then(() => this.models.Place.query().insert([
        {
          site: 'A site',
          name: 'A name',
          suitability: ['SA', 'LA'],
          holding: ['NOH', 'NSEP'],
          nacwoId: nacwoRoleId1,
          establishmentId: 8201
        },
        {
          site: 'B site',
          name: 'B name',
          suitability: ['SA'],
          holding: ['NOH'],
          nacwoId: nacwoRoleId1,
          establishmentId: 8201
        },
        {
          site: 'C site',
          name: 'C name',
          suitability: ['LA', 'DOG'],
          holding: ['SEP'],
          nacwoId: nacwoRoleId2,
          establishmentId: 8201
        },
        {
          site: 'D site',
          name: 'D name',
          suitability: ['AQ', 'AV'],
          holding: ['NSEP'],
          nacwoId: nacwoRoleId2,
          establishmentId: 8201
        }
      ]));
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('getFilterOptions', () => {
    it('returns a map of unique sites, holding codes and suitability codes', () => {
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
          }]);
        });
    });

    it('returns a map of unique sites, holding codes and suitability codes', () => {
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

    it('can sort by nacwo lastName', () => {
      const opts = {
        establishmentId: 8201,
        sort: {
          column: 'nacwo.lastName',
          ascending: 'true'
        }
      };
      return Promise.resolve()
        .then(() => this.models.Place.filter(opts))
        .then(places => {
          assert.deepEqual(places.total, 4);
          assert.deepEqual(places.results.length, 4);
          assert.deepEqual(places.results[0].nacwo.lastName, 'Archer');
          assert.deepEqual(places.results[1].nacwo.lastName, 'Archer');
          assert.deepEqual(places.results[2].nacwo.lastName, 'Malloy');
          assert.deepEqual(places.results[3].nacwo.lastName, 'Malloy');
        });
    });

    it('eager loads nacwo', () => {
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
          assert.deepEqual(places.results[0].nacwo.firstName, 'Sterling');
        });
    });
  });
});
