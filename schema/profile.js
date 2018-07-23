const { merge, chain, omit } = require('lodash');
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

  Profile.getFilterOptions = ({ where }) => {
    return Profile.aggregate('type', 'DISTINCT', {
      plain: false,
      include: [{ model: db.models.role, duplicating: false }],
      where: omit(where, 'roles')
    })
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

  Profile.searchAndCountAll = ({ search, ...rest }) => {

    const roles = rest.where.roles;
    rest.where = omit(rest.where, 'roles');

    const where = {
      [Op.and]: []
    };

    if (search) {
      where[Op.and].push(
        {
          [Op.or]: [
            Profile.searchFullName(search),
            { '$pil.licenceNumber$': { [Op.iLike]: `%${search}%` } }
          ]
        }
      );
    }

    if (roles) {
      where[Op.and].push(
        db.where(
          db.cast(db.col('roles.type'), 'TEXT'),
          { [Op.eq]: roles }
        )
      );
    }

    const settings = merge({
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
      }],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    }, rest);

    return Promise.all([
      Profile.count({ where: rest.where }),
      Profile.findAndCountAll(settings)
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
