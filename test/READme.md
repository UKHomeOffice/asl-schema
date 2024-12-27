# Test setup
**1**
````
const { knexInstance: dbInstance } = dbHelper;
const knexInstance = Knex({
...dbInstance.client.config
});
````
- LOAD INSTANCE SETTINGS FROM KNEXFILE USING HELPER METHOD.
CREATES SINGLETON SQL INSTANCE WITH KNEX.

**2**
````
model = await dbHelper.init();
  await dbHelper.clean(model);
  BaseModel.knex(knexInstance);
````
- SETUP SCHEMA init(). 
- TRUNCATE TABLES clean(model)
- POWER UP OBJECTION-MODEL 'OBJECT | POJO' i.e establistment, rops etc; WITH KNEX, SO YOU CAN QUERY THESE MODELS RESULTS IN QUERING SCHEMA/ TABLES.

**3**
````
await knexInstance.destroy();
````
- SINGLETON KNEX KILL INSTANCE.

**4**
````
  const { knexInstance: dbInstance } = dbHelper;
  const client = dbInstance.client.config.client;
  const connection = dbInstance.client.config.connection;

  const knexInstance = Knex({
    client: client,
    connection: connection
  });
````
SOMETIME BASIC ALL OBJECT DONEN'T WORK, SO WE PASS IT AS THIS.

**5**
````
// WHAT IS IT ...knexSnakeCaseMappers()
const knexInstance = Knex({
...dbInstance.client.config,
...knexSnakeCaseMappers()
});
````
ITS AN OBJECTION METHOD TO TRANSFORM THE ATTRIBUTES.
