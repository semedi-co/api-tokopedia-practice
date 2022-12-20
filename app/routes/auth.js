const routes = require("express").Router();

const controller = require("../controllers/authController");

// Start Routes Stores Table
routes.post("/register", controller.register);
routes.post("/login", controller.login);
// End Routes Stores Table

module.exports = routes;