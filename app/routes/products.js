const routes = require("express").Router();

// controller 
const controller = require("../controllers/products.controller");

// routes POST 
routes.post("/", controller.addProduct);
// routes GET 
routes.get("/", controller.getAll);
routes.get("/:id", controller.getDetail);
// routes PUT 
routes.put("/:id", controller.update);
// routes DELETE 
routes.delete("/:id", controller.delete);
// routes PATCH 
routes.patch("/:id", controller.updateImage);

module.exports = routes;