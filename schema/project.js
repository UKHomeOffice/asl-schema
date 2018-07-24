const { STRING, ENUM, DATE, UUID, UUIDV1, Op } = require('sequelize');
const BaseQueryBuilder = require('../lib/query-builder');

module.exports = db => {

  const Project = db.define('project', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    status: { type: ENUM('active', 'pending', 'inactive', 'expired', 'revoked'), defaultsTo: 'inactive' },
    title: { type: STRING, allowNull: false },
    issueDate: DATE,
    expiryDate: DATE,
    revocationDate: DATE,
    licenceNumber: STRING
  });

  class QueryBuilder extends BaseQueryBuilder {
    search(search) {
      if (!search) {
        return this;
      }
      return this.where({
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { licenceNumber: { [Op.iLike]: `%${search}%` } },
          db.models.profile.searchFullName(search, 'licenceHolder')
        ]
      });
    }
  }

  Project.query = query => {
    return new QueryBuilder(Project, query);
  };

  return Project;
};
