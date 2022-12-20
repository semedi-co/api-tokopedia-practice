const routes = require("express").Router()
const controller = require("../controller/auth.controller")

routes.post("/", controller.login)

module.exports= routes