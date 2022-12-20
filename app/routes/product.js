const routes = require("express").Router()
const controller = require("../controller/product.controller")
// get data
routes.get("/", controller.getAll)
routes.get("/:id", controller.getDetail)
// create product
routes.post("/", controller.addProduct)
// update data
routes.put("/:id", controller.updateData)
routes.delete("/:id", controller.deleteProduct)

module.exports= routes;