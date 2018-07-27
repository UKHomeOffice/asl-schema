const { chain } = require('lodash');
const { UUID, UUIDV1, STRING, DATEONLY, TEXT, Op } = require('sequelize');
const BaseQueryBuilder = require('../lib/query-builder');

module.exports = db => {

  const Profile = db.define('profile', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    userId: { type: STRING, unique: true },
    title: STRING,
    firstName: { type: STRING, allowNull: false },
    lastName: { type: STRING, allowNull: false },
    dob: DATEONLY,
    position: STRING,
    qualifications: STRING,
    certifications: STRING,
    address: STRING,
    postcode: STRING,
    email: { type: STRING, allowNull: false, unique: true },
    telephone: STRING,
    notes: TEXT
  }, {
    getterMethods: {
      name() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  });

  Profile.getFilterOptions = options => {
    return Profile.aggregate('roles.type', 'DISTINCT', { ...options, plain: false })
      .then(result => chain(result.map(r => r.DISTINCT))
        .flatten()
        .compact()
        .uniq()
        .value()
        .sort()
      );
  };

  Profile.searchFullName = (search, prefix = '') => {
    let firstName = 'firstName';
    let lastName = 'lastName';
    if (prefix) {
      firstName = `$${prefix}.${firstName}$`;
      lastName = `$${prefix}.${lastName}$`;
    }
    search = search.split(' ');
    if (search.length > 1) {
      return {
        [Op.and]: [
          { [firstName]: { [Op.iLike]: `%${search[0]}` } },
          { [lastName]: { [Op.iLike]: `${search[1]}%` } }
        ]
      };
    }
    return {
      [Op.or]: [
        { [firstName]: { [Op.iLike]: `%${search[0]}%` } },
        { [lastName]: { [Op.iLike]: `%${search[0]}%` } }
      ]
    };
  };

  class QueryBuilder extends BaseQueryBuilder {
    setEstablishment(id) {
      return this._addToQuery({
        include: [{
          model: db.models.establishment,
          where: { id },
          duplicating: false
        }]
      });
    }

    search(search) {
      if (!search) {
        return this;
      }
      return this.where({
        [Op.or]: [
          Profile.searchFullName(search),
          { '$pil.licenceNumber$': { [Op.iLike]: `%${search}%` } }
        ]
      });
    }

    filterByRole(role) {
      if (!role) {
        return this;
      }
      return this.where({
        [db.col('roles.type')]: db.where(
          db.cast(db.col('roles.type'), 'TEXT'),
          { [Op.eq]: role }
        )
      });
    }

    hasPIL(pil) {
      if (!pil) {
        return this;
      }
      return this.where({
        '$pil.id$': {
          [Op.ne]: null
        }
      })
    }

    hasPPL(ppl) {
      if (!ppl) {
        return this;
      }
      return this.where({
        '$projects.id$': {
          [Op.ne]: null
        }
      })
    }
  }

  Profile.query = (query) => {
    return new QueryBuilder(Profile, query);
  };

  return Profile;
};
