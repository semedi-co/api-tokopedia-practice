const routes = require("express").Router();

const controller = require("../controllers/stores.controller");

// routes GET 
routes.get("/", controller.getAll);
// routes POST 
routes.post("/", controller.create);
// routes PATCH
routes.patch("/avatar", controller.ChangeAvatar);
// routes PUT 
routes.put("/:id", controller.update);
// routes DELETE 
routes.delete("/:id", controller.deleteAvatar);
routes.delete("/:id", controller.delete);

module.exports = routes;