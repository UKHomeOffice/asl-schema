const assert = require('assert');
const db = require('./helpers/db');

const validEstablishment = {
  id: 8201,
  name: 'University of life',
  email: 'info@university.of.life',
  country: 'england',
  address: '123 Somwhere Street'
};

describe('Establishment model', () => {

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return db.clean(this.models);
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('Validation', () => {
    it('throws an error if validation fails', () => {
      const { Establishment } = this.models;
      return assert.rejects(() => Establishment.query().insert({ id: 8201 }), {
        name: 'ValidationError'
      });
    });

    it('doesn\'t throw if establishment is valid', () => {
      const { Establishment } = this.models;
      return assert.doesNotReject(() => {
        return Establishment.query().insert(validEstablishment);
      });
    });

  });

  describe('Querying', () => {
    it('has a getPELH method which returns associated PELH', () => {
      const { Establishment } = this.models;
      return Promise.resolve()
        .then(() => {
          return Establishment.query().insertGraph({
            ...validEstablishment,
            roles: [{
              type: 'pelh',
              profile: {
                firstName: 'Sterling',
                lastName: 'Archer',
                email: 'sterling@archer.com'
              }
            }]
          });
        })
        .then(() => Establishment.query().findById(8201))
        .then(e => e.getPELH())
        .then(pelh => {
          assert.equal(pelh.email, 'sterling@archer.com');
        });
    });
  });

});
