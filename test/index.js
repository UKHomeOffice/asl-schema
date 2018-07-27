const assert = require('assert');
// const Schema = require('../schema');
const db = require('../')();

describe('Schema', () => {

  // it('can initialise without error', () => {
  //   assert.equal(typeof Schema, 'function');
  // });

  const subquery = db.Project.query().select('licenceHolderId');

  it('can deal with models', () => {
    return db.Profile.query()
      .skipUndefined()
      .distinct('profiles.*')
      // .eager('projects')
      // .whereIn('profiles.id', subquery)
      // .leftJoin('projects', 'profiles.id', 'projects.licenceHolderId')
      // .where('profiles.id', 'in', subquery)
      // .whereNot('projects.id', null)
      // .eager('projects')
      .leftJoinRelation('projects')
      .whereNot('projects.id', null)
      .page(0, 100)
      .debug()
      //
      // .where('project', '!=', undefined)
      // .page(1, 10)
      .then(profiles => {
        console.log(profiles)
      })
  })

});
