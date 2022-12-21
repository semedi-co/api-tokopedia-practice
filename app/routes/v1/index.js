const routes = require("express").Router();

// list routes
routes.use("/users", require("./users"));
routes.use("/auth", require("./auth"));

module.exports = routes;