const routes = require("express").Router();

//middleware
const authorize = require("../middlewares/authorize");

routes.use("/user", authorize, require("./user"));
routes.use("/store", authorize, require("./store"));
routes.use("/product", authorize, require("./product"));
routes.use("/storefront", authorize, require("./storefront"));
routes.use("/dservice", authorize, require("./dservice"));
routes.use("/auth", require("./auth"));
// routes.use("/v1/auth", require("./auth"));

module.exports = routes;