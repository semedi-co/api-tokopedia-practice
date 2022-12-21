/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: require("crypto").randomUUID(),
      name: 'Didik Nur Hidayat',
      username: 'didik27',
      password: require("bcrypt").hashSync("didik123", 10),
      avatar: null,
      store_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
