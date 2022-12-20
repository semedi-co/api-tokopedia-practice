/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("products", t =>{
    t.string("id").primary()
    t.string("store_id").notNullable();
    t.foreign("store_id").references("id").inTable("stores").onDelete("CASCADE")
    t.integer("storefront_id").unsigned()
    t.foreign("storefront_id").references("id").inTable("store_front").onDelete("SET NULL")
    t.string("name", 100).notNullable()
    t.integer("stok", 60).notNullable();
    t.integer("price", 100).notNullable();
    t.text("description").notNullable();
    t.integer("sold_total", 100)
    t.timestamps(true, true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("products")
};
