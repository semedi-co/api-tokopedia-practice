// Update with your config settings.
require("dotenv").config();
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_NAME_DEV,
  MYSQL_NAME_STG,
  MYSQL_NAME_PROD
} = process.env;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: MYSQL_HOST,
      port: +MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASS,
      database: MYSQL_NAME_DEV
    },
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeders"
    }
  },
  staging: {
    client: 'mysql2',
    connection: {
      host: MYSQL_HOST,
      port: +MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASS,
      database: MYSQL_NAME_STG
    },
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeders"
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: MYSQL_HOST,
      port: +MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASS,
      database: MYSQL_NAME_PROD
    },
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeders"
    }
  },
};
