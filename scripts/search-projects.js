const args = require('minimist')(process.argv.slice(2));
const { Transform } = require('stream');

const main = {
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME || 'asl',
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD
};

const Schema = require('../index');
const { ProjectVersion, Project } = Schema(main);

const searchTerm = args._[0];

if (!searchTerm) {
  console.error('No search term provided');
  process.exit(1);
}

console.log(`Searching for projects containing: "${searchTerm}"...`);
console.log();

console.log('Licence number,Title,Issue date');

const indexer = new Transform({
  writableObjectMode: true,
  readableObjectMode: true,
  transform(version, encoding, callback) {
    if (JSON.stringify(version.data).toLowerCase().includes(searchTerm)) {
      return Project.query()
        .findOne({ id: version.project_id })
        .then(result => {
          callback(null, `${result.licenceNumber},${result.title},${result.issueDate}`);
        });

    }
    callback(null);
  }
});
indexer.on('data', version => {
  console.log(version);
});
indexer.on('end', () => process.exit());
indexer.on('error', err => {
  console.error(err);
  process.exit(1);
});

ProjectVersion.query()
  .where({ status: 'granted' })
  .build()
  .stream(stream => stream.pipe(indexer));
