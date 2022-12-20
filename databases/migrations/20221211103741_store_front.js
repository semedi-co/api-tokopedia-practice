/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("store_front",t =>{
    t.increments("id"),
    t.string("store_id").notNullable(),
    t.foreign("store_id").references("id").inTable("stores").onDelete("CASCADE"),
    t.string("name", 60).notNullable(),
    t.timestamps(true, true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("store_front")
};
