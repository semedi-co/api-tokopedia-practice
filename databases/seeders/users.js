const bcrypt = require("bcrypt");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex("users").del();
    await knex("users").insert([{
        id: require("crypto").randomUUID(),
        name: "Fatahillah Mahendra",
        username: "fatah",
        password: bcrypt.hashSync("fatah12345", 10),
    }, ]);
};