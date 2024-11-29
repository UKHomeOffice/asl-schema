import projects from '../data/projects.js';

export default {
  populate: knex => {
    const aa = projects
      .filter(p => p.additionalEstablishments)
      .reduce((list, project) => {
        const aas = project.additionalEstablishments.map(e => {
          return { ...e, project_id: project.id };
        });
        return list.concat(aas);
      }, []);

    if (aa.length > 0) {
      return knex('project_establishments').insert(aa);
    }
  },
  delete: knex => knex('project_establishments').del()
};
