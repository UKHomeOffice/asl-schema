
exports.up = function (knex, Promise) {
    return knex.schema
        .table('places', table => {
            table.renameColumn('notes', 'restrictions');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('places', table => {
            table.renameColumn('restrictions', 'notes');
        });
};
