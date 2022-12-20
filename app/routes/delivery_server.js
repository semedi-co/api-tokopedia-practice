const routes = require("express").Router();

const controller = require("../controllers/delivery_service.controller");

// routes POST 
routes.post("/:store_id", controller.create);
// routes GET 
routes.get("/", controller.getAll);
routes.get("/:id", controller.getDetail);
// routes PUT 
routes.put("/:id", controller.update);
// routes DELETE 
routes.delete("/:id", controller.delete);

module.exports = routes;