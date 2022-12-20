/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", (t) => {
        t.string("id").primary().notNullable();
        t.string("name").notNullable();
        t.string("store_id");
        t.foreign("store_id").references("id").inTable("stores").onDelete("CASCADE");
        t.string("username").unique().notNullable();
        t.string("password").notNullable();
        t.string("avatar");
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users");
};