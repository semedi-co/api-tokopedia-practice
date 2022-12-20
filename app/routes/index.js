const routes = require("express").Router()

const authorization= require("../middlewares/authorize")

routes.use("/v1/users", require("./user"))
routes.use("/v1/login", require("./auth"))
routes.use("/v1/store",authorization, require("./store"))
routes.use("/v1/product",authorization, require("./product"))
routes.use("/v1/storefront",authorization, require("./storefront"))
routes.use("/v1/delivery",authorization, require("./delivery"))


module.exports= routes