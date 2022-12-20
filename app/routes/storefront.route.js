const routes = require("express").Router();

const controller = require("../controllers/storefront.controller");

routes.post("/", controller.create);
routes.get("/", controller.getall);
routes.get("/:id", controller.getdetail);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);

module.exports = routes;
