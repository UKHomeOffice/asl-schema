import moment from 'moment';

export async function up(knex) {
  const pils = await knex
    .select('id', 'updated_at', 'review_date')
    .from('pils')
    .whereNull('review_date');

  for (const pil of pils) {
    const { id, updatedAt } = pil;
    const review_date = moment(updatedAt).add(5, 'years').toISOString();

    await knex('pils')
      .where({ id })
      .update({ review_date });
  }
}

export function down(knex) {
  return Promise.resolve();
}
