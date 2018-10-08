const { knexSnakeCaseMappers } = require('objection');

try {
  // eslint-disable-next-line implicit-dependencies/no-implicit
  require('dotenv').config();
} catch (e) {}

let test = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME || 'asl-test'
  }
};

let development = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD
  }
};

// DO NOT enable SNAKE_MAPPER for migrations! @see https://github.com/tgriesser/knex/issues/2644
if (process.env.SNAKE_MAPPER) {
  test = { ...test, ...knexSnakeCaseMappers() };
  development = { ...development, ...knexSnakeCaseMappers() };
}

module.exports = {
  test,
  development
};
