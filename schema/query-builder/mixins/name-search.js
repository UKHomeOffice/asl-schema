const tsquery = require('pg-tsquery');
const stringify = tsquery();

module.exports = (Base) => {

  class NameSearch extends Base {
    whereNameMatch(search, prefix = 'profiles') {
      if (Array.isArray(search)) {
        search = search[0];
      }

      const query = stringify(search.split(/\s|-/).map(p => p + '*').join(' '));

      // remove apostrophes and accented characters from names
      const tsvector = field => `to_tsvector('simple', unaccent(replace(${prefix}.${field}, '''', '')))`;

      const sql = `(${tsvector('first_name')} || ${tsvector('last_name')}) @@ to_tsquery('simple', unaccent(?))`;

      return this.whereRaw(sql, [query]);
    }
  }

  return NameSearch;

};
