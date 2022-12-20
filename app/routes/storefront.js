const routes = require("express").Router()
const controller = require("../controller/storeFront.controller")
// get data
routes.get("/",controller.getAll)
routes.get("/:id",controller.getDetail)

// create data
routes.post("/", controller.createSf)
// update data
routes.put("/:id", controller.updateSf)
// delete data
routes.delete("/:id", controller.deleteSf)

module.exports= routes