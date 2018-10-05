# asl-schema
Sequelize schema for licensing models

* `@asl/schema` provides models for interacting with database objects

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

### Migrations

To generate migration:

```bash
knex migrate:make <_migration-file-name_>
```
The migration is generated with:

```js
exports.up = function(knex, Promise) {
  
};

exports.down = function(knex, Promise) {
  
};
```

The migration goes within the body of the ```exports.up``` function.

To undo migration, use ```exports.down```.

For examples, check out folder ```migrations```.

To run the migration:

```bash
npm run migrate
```

**Note**: it will run _all_ migrations in the folder 

To rollback migration:

```bash
npm run rollback
```

### Database Seeding

To seed , or add initial test data to the database:

```bash
npm run seed
```
