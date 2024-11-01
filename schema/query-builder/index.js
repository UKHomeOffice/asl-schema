import { Model } from 'objection';
import SoftDelete from './mixins/soft-delete.js';
import NameSearch from './mixins/name-search.js';

class QueryBuilder extends Model.QueryBuilder {
  static mixin(mx) {
    return mx(this);
  }

  scopeToEstablishment(column, establishmentId, role) {
    const query = this.context({ establishmentId })
      .joinRelation('establishments')
      .where(column, establishmentId);

    if (role) {
      query.where({ role });
    }

    return query;
  }
}

QueryBuilder.NameSearch = NameSearch;

export default QueryBuilder.mixin(SoftDelete);
