const EstablishmentModel = require('./establishment');
const PlaceModel = require('./place');

module.exports = db => {

  const Establishment = EstablishmentModel(db);
  const Place = PlaceModel(db);

  Establishment.places = Establishment.hasMany(Place);

  return {
    Establishment,
    Place
  };
};
