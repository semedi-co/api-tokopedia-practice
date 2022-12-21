const routes = require("express").Router();

// controller
const controller = require("../../controllers/auth.controller");

// route POST
routes.post("/register", controller.register);
routes.post("/login", controller.login);

module.exports = routes;