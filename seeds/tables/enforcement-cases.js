const { omit } = require('lodash');
const enforcementCases = require('../data/enforcement-cases');

module.exports = {
  populate: async knex => {
    for (const enforcementCase of enforcementCases) {
      const caseId = await knex('enforcement_cases')
        .insert(omit(enforcementCase, 'subjects'))
        .returning('id')
        .then(c => c[0].id);

      for (const enforcementSubject of enforcementCase.subjects) {
        const subjectId = await knex('enforcement_subjects')
          .insert({ ...omit(enforcementSubject, 'flags'), caseId })
          .returning('id')
          .then(s => s[0].id);

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
