const moment = require('moment');
const { get } = require('lodash');
const { Value } = require('slate');
const csv = require('csv-stringify');

const LICENCE_NUMBER = /((7|3)0(0|\/|\-)[0-9]{4})|P[0-9A-Z]{8}/g;
const EXPIRYLONG = /([0-9]{1,2})(st|nd|rd|th)? (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)(r?uary|ch|il|e|y|ust|tember|ober|ember)?  ?((20)?(19|20|21))/;
const EXPIRYLONG2 = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(r?uary|ch|ril|e|y|ust|tember|ober|ember)? ([0-9]{1,2})(st|nd|rd|th)? ((20)?(19|20|21))/;
const EXPIRYSHORT = /([0-9]{1,2})(\/|\-|\.|\s)([0-9]{1,2})(\/|\-|\.|\s)(20(19|20|21))/;

const TYPES = {
  LICENCE_NUMBER: 'Could not parse licence number',
  DATE: 'Could not parse expiry date',
  NEITHER: 'Could not parse version',
  MULTIPLE: 'Multple licence numbers found'
};

const transform = (version, loggingParams = {}, stringifier) => {
  if (!version) {
    return;
  }
  const continuationQuestion = version['expiring-yes'];
  // not a continuation
  if (!continuationQuestion) {
    return;
  }

  // already patched
  if (version['project-continuation']) {
    return;
  }

  const { versionId, projectId, projectStatus, versionStatus } = loggingParams;

  const obj = Value.fromJSON(JSON.parse(continuationQuestion));
  const text = obj.document.nodes.map(node => node.text.trim()).filter(node => node).join('\n\n');

  const ppl = text.match(LICENCE_NUMBER) || [];

  let date;
  if (text.match(EXPIRYLONG)) {
    const matched = text.match(EXPIRYLONG);
    const day = matched[1];
    const month = matched[3];
    const year = matched[7];
    date = moment(`${day} ${month} ${year}`, 'DD MMM YY');
  } else if (text.match(EXPIRYLONG2)) {
    const matched = text.match(EXPIRYLONG2);
    const day = matched[25];
    const month = matched[1];
    const year = matched[29];
    date = moment(`${day} ${month} ${year}`, 'DD MMM YY');
  } else if (text.match(EXPIRYSHORT)) {
    const matched = text.match(EXPIRYSHORT);
    let day = matched[1];
    let month = matched[3];
    const year = matched[6];
    if (day.length === 1) {
      day = '0' + day;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    date = moment(`${day} ${month} ${year}`, 'DD MM YY');
  }

  if (!ppl.length && !date) {
    console.log(`Cannot parse versionId: ${versionId}`);
    stringifier && stringifier.write([TYPES.NEITHER, projectId, versionId, projectStatus, versionStatus]);
    return;
  }

  if (!ppl.length) {
    console.log(`Unable to parse licence number, versionId: ${versionId}`);
    stringifier && stringifier.write([TYPES.LICENCE_NUMBER, projectId, versionId, projectStatus, versionStatus]);
  }

  if (ppl.length > 1) {
    console.log(`Multple licence numbers found for versionId: ${versionId}`);
    stringifier && stringifier.write([TYPES.MULTIPLE, projectId, versionId, projectStatus, versionStatus]);
  }

  if (!date) {
    console.log(`Unable to parse expiry date, versionId: ${versionId}`);
    stringifier && stringifier.write([TYPES.DATE, projectId, versionId, projectStatus, versionStatus]);
  }

  return {
    'project-continuation': [
      {
        'licence-number': get(ppl, 0, null),
        'expiry-date': date ? date.format('YYYY-MM-DD') : null
      }
    ]
  }
};

exports.transform = transform;

exports.up = function(knex) {
  const stringifier = csv();
  stringifier.write(['Type', 'Project ID', 'Version ID', 'Project Status', 'Version Status']);
  return Promise.resolve()
    .then(() => {
      return knex('project_versions')
        .select('project_versions.id')
        .join('projects', 'project_versions.project_id', 'projects.id')
        .where({ 'schema_version':  1 });
    })
    .then(versions => {
      console.log(`found ${versions.length} versions`)
      return versions.reduce((promise, version, index) => {
        return promise
          .then(() => {
            console.log(`patching version: ${version.id}, ${index + 1} of ${versions.length}`);
            return knex('project_versions')
              .join('projects', 'project_versions.project_id', 'projects.id')
              .select('project_versions.id', 'data', 'project_versions.status', 'projects.status as projectStatus', 'project_id')
              .where({ 'project_versions.id': version.id })
              .first()
              .then(version => {
                const loggingParams = {
                  versionId: version.id,
                  projectId: version.project_id,
                  versionStatus: version.status,
                  projectStatus: version.projectStatus
                };
                const data = transform(version.data, loggingParams, stringifier);
                if (!data) {
                  console.log(`Skipping ${version.id}.`)
                  return Promise.resolve();
                }
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ data: { ...version.data, ...data } });
              })
              .then(() => {
                console.log(`finshed patching version: ${version.id}, ${index + 1} of ${versions.length}`);
              });
          })
          .catch(e => {
            console.error(`Failed to update project version: ${version.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve())
    })
    .then(() => {
      stringifier.pipe(process.stdout);
      stringifier.end();
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
