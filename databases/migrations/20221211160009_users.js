/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", t => {
    t.string("id", 36).primary();
    t.string("name").notNullable();
    t.string("store_id");
    t.foreign("store_id").references("id").inTable("stores").onDelete("SET NULL");
    t.string("email", 100).unique().notNullable();
    t.string("password").notNullable();
    t.string("avatar", 100);
    t.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
