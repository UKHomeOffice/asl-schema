const trainingCourses = require('../data/training-courses.json');

module.exports = {
  populate: knex => {
    return knex('training_courses').insert(trainingCourses.map(t => ({ ...t, species: JSON.stringify(t.species) })));
  }
};
