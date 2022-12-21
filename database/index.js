require("dotenv").config();
const {
  NODE_ENV
} = process.env;

let init = null;
if (NODE_ENV == "development") {
  init = require("knex")(require("../knexfile").development);
} else if (NODE_ENV == "staging") {
  init = require("knex")(require("../knexfile").staging);
} else if (NODE_ENV == "production") {
  init = require("knex")(require("../knexfile").production);
} else {
  console.error("wrong environment");
}

module.exports = init;