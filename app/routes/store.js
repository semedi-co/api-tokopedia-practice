const routes = require("express").Router()
const controller = require("../controller/store.controller")

routes.get("/", controller.getAll)
routes.get("/:id", controller.getDetail)

routes.post("/", controller.createStore)
routes.put("/:id",controller.updateStore)
routes.patch("/image/:id",controller.addImage)
routes.delete("/:id",controller.deleteStore)


module.exports = routes