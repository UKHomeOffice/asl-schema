const assert = require('assert');
const db = require('./helpers/db');

describe('Profile model', () => {

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
          profiles: [
            {
              firstName: 'Vincent',
              lastName: 'Malloy',
              email: 'vincent@malloy.com'
            },
            {
              firstName: 'Sterling',
              lastName: 'Archer',
              email: 'sterling@archer.com',
              pil: {
                establishmentId: 8201,
                licenceNumber: 'ABC-123-02'
              }
            },
            {
              firstName: 'Keith',
              lastName: 'Lemon',
              email: 'keith@lemon.com',
              pil: {
                establishmentId: 8201,
                licenceNumber: 'ABC-123-03'
              },
              roles: [{
                establishmentId: 8201,
                type: 'nacwo'
              }]
            },
            {
              firstName: 'Bruce',
              lastName: 'Forsyth',
              email: 'bruce@forsyth.com',
              pil: {
                establishmentId: 8201,
                licenceNumber: 'ABC-123-04'
              },
              roles: [{
                establishmentId: 8201,
                type: 'nacwo'
              }]
            },
            {
              firstName: 'Stuart',
              lastName: 'Little',
              email: 'stuart@little.com',
              projects: [{
                establishmentId: 8201,
                title: 'Anti cancer research'
              }]
            }
          ]
        },
        {
          id: 8202,
          name: 'Another establishment',
          email: 'another@establishment.com',
          address: '123 Another street',
          country: 'wales',
          profiles: [
            {
              firstName: 'Austin',
              lastName: 'Powers',
              email: 'groovy@baby.com',
              pil: {
                establishmentId: 8202,
                licenceNumber: 'ABC-123-06'
              }
            },
            {
              firstName: 'Clark',
              lastName: 'Kent',
              email: 'super@man.com',
              pil: {
                establishmentId: 8202,
                licenceNumber: 'ABC-123-07'
              }
            }
          ]
        }
      ]));
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('search', () => {
    it('can search on full name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'cent mal'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Vincent');
          assert.deepEqual(profiles.results[0].lastName, 'Malloy');
        });
    });

    it('can search on full name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'ster'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Sterling');
          assert.deepEqual(profiles.results[0].lastName, 'Archer');
        });
    });

    it('can search on full name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Powers1'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 0);
        });
    });

    it('can search on licenceNumber', () => {
      const opts = {
        establishmentId: 8201,
        search: '03'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Keith');
          assert.deepEqual(profiles.results[0].lastName, 'Lemon');
        });
    });
  });

  describe('filter', () => {
    it('can filter nacwo roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          roles: ['nacwo']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 2);
          assert.deepEqual(profiles.results.map(p => p.firstName).sort(), ['Bruce', 'Keith']);
        });
    });

    it('can filter pilh pseudo roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          roles: ['pilh']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 3);
          assert.deepEqual(profiles.results.map(p => p.firstName).sort(), ['Bruce', 'Keith', 'Sterling']);
        });
    });

    it('can filter pelh pseudo roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          roles: ['pplh']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Stuart');
        });
    });
  });

  describe('searching and filtering', () => {
    it('can search and filter', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Bruce',
        filters: {
          roles: ['pilh']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Bruce');
        });
    });

    it('accepts pagination params', () => {
      const opts = {
        establishmentId: 8201,
        search: 'ABC',
        filters: {
          roles: ['pilh']
        },
        limit: 1,
        offset: 1
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 3);
          assert.deepEqual(profiles.results.length, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Bruce');
        });
    });

    it('accepts sort params', () => {
      const opts = {
        establishmentId: 8201,
        search: 'ABC',
        filters: {
          roles: ['pilh']
        },
        sort: {
          column: 'firstName',
          ascending: 'false'
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 3);
          assert.deepEqual(profiles.results.length, 3);
          assert.deepEqual(profiles.results[0].firstName, 'Sterling');
          assert.deepEqual(profiles.results[1].firstName, 'Keith');
          assert.deepEqual(profiles.results[2].firstName, 'Bruce');
        });
    });
  });
});
