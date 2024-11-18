import pkg from 'lodash';
import enforcementCases from '../data/enforcement-cases.js';

const {omit} = pkg;

export default {
  populate: async knex => {
    for (const enforcementCase of enforcementCases) {
      const {id: caseId} = await knex('enforcement_cases')
        .insert(omit(enforcementCase, 'subjects'))
        .returning('id')
        .then(c => c[0]);

      for (const enforcementSubject of enforcementCase.subjects) {
        const {id: subjectId} = await knex('enforcement_subjects')
          .insert({ ...omit(enforcementSubject, 'flags'), caseId })
          .returning('id')
          .then(s => s[0]);

        const flags = enforcementSubject.flags.map(f => ({ ...f, subjectId }));
        await knex('enforcement_flags').insert(flags);
      }
    }
  },
  delete: async knex => {
    await knex('enforcement_flags').del();
    await knex('enforcement_subjects').del();
    await knex('enforcement_cases').del();
  }
};
