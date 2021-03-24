module.exports = (Base) => {

  class NameSearch extends Base {
    whereNameMatch(search, prefix = 'profiles') {
      if (Array.isArray(search)) {
        search = search[0];
      }
      const parts = search.split(' ').join(' & ');
      const q = `(to_tsvector(unaccent(${prefix}.first_name)) || to_tsvector(unaccent(${prefix}.last_name))) @@ to_tsquery('${parts}')`;

      return this.whereRaw(q);
    }
  }

  return NameSearch;

};
