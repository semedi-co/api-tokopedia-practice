const routes = require("express").Router();

const controller = require("../controllers/storefrontController");

// Start Routes Stores Table
routes.post("/", controller.create);
// routes.get("/", controllerUser.getDetail);
routes.get("/", controller.getAll);
// routes.patch("/:id", controller.updateAvatar);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);
// End Routes Stores Table

module.exports = routes;