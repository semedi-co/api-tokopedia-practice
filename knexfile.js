require("dotenv").config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_NAME } = process.env;
module.exports = {
    development: {
        client: "mysql2",
        connection: {
            host: MYSQL_HOST,
            port: +MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: MYSQL_NAME,
        },
        migrations: {
            directory: "./databases/migrations",
        },
        seeds: {
            directory: "./databases/seeders",
        },
    },

    //     staging: {
    //         client: "postgresql",
    //         connection: {
    //             database: "my_db",
    //             user: "username",
    //             password: "password",
    //         },
    //         pool: {
    //             min: 2,
    //             max: 10,
    //         },
    //         migrations: {
    //             tableName: "knex_migrations",
    //         },
    //     },

    //     production: {
    //         client: "postgresql",
    //         connection: {
    //             database: "my_db",
    //             user: "username",
    //             password: "password",
    //         },
    //         pool: {
    //             min: 2,
    //             max: 10,
    //         },
    //         migrations: {
    //             tableName: "knex_migrations",
    //         },
    //     },
};