const routes = require("express").Router();

const controller = require("../controllers/auth.controller");
const controllers = require("../controllers/users.controller");

routes.post("/register", controllers.create);
routes.post("/login", controller.login);

module.exports = routes;