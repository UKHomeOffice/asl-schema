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

### Database setup

Scripts for setting up a local database with dev data are available in the [`asl-schema` project](https://github.com/ukhomeoffice/asl-schema). First clone that repo and install the dependencies. Then run the following commands in the schema project directory:

To setup the inital table schemas:

```
npm run migrate
```

To seed the database with a development dataset:

```
npm run seed
```

_Note: these scripts will require the database described by `DATABASE_NAME` to be created before they can run. If running against services run with [`asl-conductor`](https://github.com/ukhomeoffice/asl-conductor) then this will be done automatically._

