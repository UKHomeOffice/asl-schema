const { knexSnakeCaseMappers } = require('objection');

try {
  // eslint-disable-next-line implicit-dependencies/no-implicit
  require('dotenv').config();
} catch (e) {}

const snakeCaseMapper = process.env.SNAKE_MAPPER ? knexSnakeCaseMappers() : {};

module.exports = {
  test: {
    ...snakeCaseMapper,
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST || 'localhost',
      database: 'asl-test',
      user: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 1,
      max: 2
    }
  },
  development: {
    ...snakeCaseMapper,
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 1,
      max: 2
    }
  }
};
