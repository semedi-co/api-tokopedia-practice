const routes = require("express").Router()
const controller = require("../controller/delivery.controller")

// get data
routes.get("/", controller.getAll)
routes.get("/:id", controller.getDetail)


// create data
routes.post("/", controller.createData)
// update data
routes.put("/:id", controller.updateSf)
// delete data
routes.delete("/:id", controller.delete)

module.exports= routes