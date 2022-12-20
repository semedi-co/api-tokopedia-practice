const routes = require("express").Router();

// middleware
const authorize = require("../middlewares/authorize");

routes.use("/v1/auth", require("./auth"));
routes.use("/v1/user", authorize, require("./users"));
routes.use("/v1/store", authorize, require("./stores"));
routes.use("/v1/product", authorize, require("./products"));
routes.use("/v1/storefront", authorize, require("./storefront"));
routes.use("/v1/delivery-service", authorize, require("./delivery_server"));

module.exports = routes;