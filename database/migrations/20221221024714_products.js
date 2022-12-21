/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("products", t => {
    t.string("id").primary();
    t.string("store_id").notNullable();
    t.foreign("store_id").references("id").inTable("stores").onDelete("CASCADE");
    t.integer("storefront_id").unsigned().notNullable();
    t.foreign("storefront_id").references("id").inTable("storefront").onDelete("CASCADE");
    t.string("name").notNullable();
    t.text("description").notNullable();
    t.integer("price").notNullable();
    t.integer("stock").notNullable();
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("products");
};
