const { merge } = require('lodash');
const { Op } = require('sequelize');
const { UUID, UUIDV1, STRING, DATEONLY, TEXT } = require('sequelize');

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

  Profile.searchAndCountAll = ({ search, ...rest }) => {

    const searchFullName = search => {
      search = search.split(' ');
      if (search.length > 1) {
        return {
          [Op.and]: [
            { firstName: { [Op.iLike]: `%${search[0]}` } },
            { lastName: { [Op.iLike]: `${search[1]}%` } }
          ]
        };
      }
      return {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search[0]}%` } },
          { lastName: { [Op.iLike]: `%${search[0]}%` } }
        ]
      };
    };

    const where = search
      ? {
        [Op.or]: [
          searchFullName(search),
          { '$pil.licenceNumber$': { [Op.iLike]: `%${search}%` } },
          // cast ENUM field to TEXT for search
          db.where(db.cast(db.col('type'), 'TEXT'), { [Op.eq]: search })
        ]
      }
      : {};

    return Promise.all([
      Profile.count(),
      Profile.findAndCountAll(merge({
        where,
        include: [{
          model: db.models.role,
          duplicating: false,
          attributes: ['type']
        },
        {
          model: db.models.pil,
          duplicating: false,
          attributes: ['licenceNumber']
        },
        {
          model: db.models.project,
          duplicating: false,
          attributes: ['title']
        }],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      }, rest))
    ])
      .then(([ total, result ]) => {
        return {
          ...result,
          total
        };
      });
  };

  return Profile;

};
