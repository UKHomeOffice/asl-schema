import pkg from 'lodash';
import trainingCourses from '../data/training-courses.js';

const {omit} = pkg;

export default {
  populate: async (knex) => {
    for (const course of trainingCourses) {
      // Insert the training course and get the inserted ID
      const [id] = await knex('training_courses').insert({
        ...omit(course, 'participants'),
        species: JSON.stringify(course.species)
      }).returning('id');

      const _id = id.id;
      // Map participants to include the training_course_id
      const participants = (course.participants || []).map(participant => ({
        ...participant,
        training_course_id: _id // Use the actual ID for the participants
      }));
      // If there are participants, insert them into training_pils
      if (participants.length > 0) {
        await knex('training_pils').insert(participants);
      }
    }
  }
};
