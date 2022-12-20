const routes = require("express").Router();

const controller = require("../controllers/storesController");
const controllerUser = require("../controllers/usersController");

// Start Routes Stores Table
routes.post("/", controller.create);
routes.get("/", controllerUser.getDetail);
routes.get("/all", controller.getAll);
routes.patch("/:id", controller.updateAvatar);
routes.put("/", controller.update);
routes.delete("/:id", controller.delete);
// End Routes Stores Table

module.exports = routes;