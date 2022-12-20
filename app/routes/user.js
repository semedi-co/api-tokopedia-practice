const routes = require("express").Router()
const controller = require("../controller/user.controller")
const authorization = require("../middlewares/authorize")

routes.get("/", authorization, controller.getAll)
routes.get("/:id", authorization, controller.getDetail)

routes.post("/", controller.createUser)
routes.put("/:id", authorization, controller.updateUser)
routes.delete("/:id", authorization, controller.deleteUser)
// change avatar
routes.patch("/avatar", authorization,controller.addAvatar)
routes.delete("/", authorization,controller.deleteAvatar)
module.exports= routes;