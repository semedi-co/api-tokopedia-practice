const routes = require("express").Router();

const controller = require("../controllers/store.controller");

routes.post("/", controller.create);
routes.get("/", controller.getall);
routes.get("/info", controller.getdetails);
routes.put("/edit", controller.update);
routes.patch("/avatar", controller.updateavatar);
routes.delete("/:id", controller.delete);

module.exports = routes;