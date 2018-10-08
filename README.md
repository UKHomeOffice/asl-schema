# asl-schema
Objection.js schema for licensing models.

* `@asl/schema` provides models for interacting with database records.

## Usage

Install the package:

```bash
npm install @asl/schema --save-prod
```

Import as necessary:

```js
const db = require('@asl/schema');
const models = db(settings.db);
```

## Configuration

The service can be configured for local development by setting environment variables in a `.env` file.

The following environment variables are required:

* `DATABASE_NAME` - the name of your postgres database

### Implementation

To facilitate database connection using postgres, migrations, and seeds we use [knex](https://knexjs.org/).

To query the database, we use [Objection.js ORM](http://vincit.github.io/objection.js/#introduction).

### Property and column naming

Postgres is case-insensitive when it comes to table and column names, so the convention is to use snake_case in the
database. However, we would prefer our model objects to use camelCase, so we need to map between the formats.

This can be done automatically by enabling
[`knexSnakeCaseMappers`](https://vincit.github.io/objection.js/#snake-case-to-camel-case-conversion), which allows us to
use camelCase for all model properties, relations, and seed data. The only place the mapping is not performed is for
migrations, where it would not make sense.

### Migrations

To generate a new migration:

```bash
knex migrate:make <_migration-file-name_>
```
A migration file is generated with:

```js
exports.up = function(knex, Promise) {

};

exports.down = function(knex, Promise) {

};
```

The migration goes within the body of the ```exports.up``` function.

To undo migration, use ```exports.down```.

For existing examples, see the folder ```migrations```.

To run the migrations:

```bash
npm run migrate
```

**Note**: this will run _all_ migrations in the folder which have not already been performed. Previously
executed migrations are stored in a special table called `knex_migrations`.

To rollback the migrations:

```bash
npm run rollback
```

For more information, see https://knexjs.org/#Migrations.

### Database Seeding

To seed, or add initial test data to the database:

```bash
npm run seed
```
