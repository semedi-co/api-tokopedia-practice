/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", t =>{
    t.string("id").primary();
    t.string("name", 60).notNullable();
    t.string("store_id")
    t.foreign("store_id").references("id").inTable("stores").onDelete("SET NULL");
    t.string("username", 100).unique().notNullable();
    t.string("password",255).notNullable();
    t.string("avatar", 100);
    t.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users")
};
