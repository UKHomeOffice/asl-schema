const EstablishmentModel = require('./establishment');
const PlaceModel = require('./place');
const RoleModel = require('./role');
const ProfileModel = require('./profile');
const AuthorisationModel = require('./authorisation');

module.exports = db => {

  const Establishment = EstablishmentModel(db);
  const Place = PlaceModel(db);
  const Role = RoleModel(db);
  const Profile = ProfileModel(db);
  const Authorisation = AuthorisationModel(db);

  Establishment.places = Establishment.hasMany(Place);
  Establishment.authorisations = Establishment.hasMany(Authorisation);
  Establishment.hasMany(Role);
  Establishment.hasMany(Profile);

  Place.nacwo = Place.belongsTo(Role, { as: 'nacwo' });
  Place.establishment = Place.belongsTo(Establishment, { as: 'establishment' });

  Role.profile = Role.belongsTo(Profile);
  Role.hasMany(Place, { foreignKey: 'nacwoId' });
  Profile.hasMany(Role);

  Profile.establishment = Profile.belongsTo(Establishment);

  return {
    Establishment,
    Place,
    Role,
    Profile,
    Authorisation,

    sync: opts => db.sync(opts),
    close: () => db.close()
  };

};
