const { merge } = require('lodash');
const { STRING, ENUM, DATE, UUID, UUIDV1, Op } = require('sequelize');

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

  Project.searchAndCountAll = ({ search, where, ...rest }) => {
    const establishmentId = where.establishmentId;
    const expiryDate = where.expiryDate;
    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              { title: { [Op.iLike]: `%${search}%` } },
              { licenceNumber: { [Op.iLike]: `%${search}%` } },
              db.models.profile.searchFullName(search, 'licenceHolder')
            ]
          }
        ]
      };
    }

    const settings = merge({
      where,
      include: {
        model: db.models.profile,
        as: 'licenceHolder',
        duplicating: false
      }
    }, rest);

    return Promise.all([
      Project.count({ where: { establishmentId, expiryDate } }),
      Project.findAndCountAll(settings)
    ]);
  };

  return Project;

};
