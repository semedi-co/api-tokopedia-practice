const routes = require("express").Router();

const controller = require("../controllers/productsController");

// Start Routes Stores Table
routes.post("/", controller.create);
routes.get("/", controller.getAll);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);
routes.get("/:id", controller.getDetail);
routes.patch("/:id", controller.updateImage);
// End Routes Stores Table

module.exports = routes;