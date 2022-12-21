const routes = require("express").Router();

// list routes version
routes.use("/v1", require("./v1"));

module.exports = routes;