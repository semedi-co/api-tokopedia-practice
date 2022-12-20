const routes = require("express").Router();

// controller 
const controller = require("../controllers/auth.controller");

// routes POST 
routes.post("/login", controller.login);
routes.post("/register", controller.register);

module.exports = routes;