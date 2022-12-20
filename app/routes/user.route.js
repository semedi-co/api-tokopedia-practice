const routes = require("express").Router();
const controller = require("../controllers/users.controller");
const authorization = require("../middleware/authorize")


// routes.post("/register", controller.create);
routes.get("/",authorization, controller.getall);
routes.get("/info",authorization, controller.getdetails);
routes.put("/edit",authorization, controller.update);
routes.patch("/avatar",authorization, controller.updateavatar);
routes.delete("/delimage", authorization, controller.deleteimage);
routes.delete("/del", authorization, controller.delete);

module.exports = routes;