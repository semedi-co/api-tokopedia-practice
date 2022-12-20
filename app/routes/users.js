const routes = require("express").Router();

// controller
const controller = require("../controllers/users.controller");

// routes PATCH
routes.patch("/avatar", controller.updateAvatar);
// routes PUT
routes.put("/:id", controller.updateData);
// routes DELETE
routes.delete("/avatar", controller.deleteAvatar);
routes.delete("/:id", controller.delete);
// routes GET
routes.get("/:id", controller.getDetail);

module.exports = routes;
