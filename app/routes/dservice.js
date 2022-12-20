const routes = require("express").Router();

const controller = require("../controllers/delivery_serviceController");

// Start Routes Stores Table
routes.post("/", controller.create);
routes.get("/", controller.getAll);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);
// End Routes Stores Table

module.exports = routes;