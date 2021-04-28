const { omit } = require('lodash');
const trainingCourses = require('../data/training-courses.json');

module.exports = {
  populate: knex => {
    return trainingCourses.reduce((promise, course) => {
      return Promise.resolve()
        .then(() => {
          return knex('training_courses').insert({
            ...omit(course, 'participants'),
            species: JSON.stringify(course.species)
          }).returning('id');
        })
        .then(([id]) => {
          const participants = (course.participants || []).map(participant => {
            return {
              ...participant,
              training_course_id: id
            };
          });
          if (participants.length > 0) {
            return knex('training_pils').insert(participants);
          }
        });
    }, Promise.resolve());
  }
};
