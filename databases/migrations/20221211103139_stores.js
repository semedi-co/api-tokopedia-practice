/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("stores", t =>{
    t.string("id").primary();
    t.string("name", 100).notNullable();
    t.string("avatar", 100)
    t.text("address").notNullable();
    t.timestamps(true,true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("stores");
};
