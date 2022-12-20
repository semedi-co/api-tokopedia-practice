const routes = require("express").Router();

const controller = require("../controllers/usersController");

// Start Routes Stores Table
routes.patch("/", controller.updateAvatar);
routes.put("/data", controller.updateData);
routes.delete("/delete", controller.delete);
routes.delete("/avatar", controller.deleteAvatar);
// End Routes Stores Table

module.exports = routes;