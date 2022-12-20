const routes = require("express").Router();

const controller = require("../controllers/product.controller");

routes.post("/", controller.create);
routes.get("/", controller.getall);
routes.get("/:id", controller.getdetails);
routes.put("/:id", controller.updateproduct);
routes.put("/image/:id", controller.updateavatar);
routes.delete("/:id", controller.delete);
routes.delete("/image/:id", controller.deleteimage);


module.exports = routes;