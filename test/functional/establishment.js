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

});
