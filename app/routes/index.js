const routes = require("express").Router();

const authorization = require("../middleware/authorize");

routes.use("/v1/user", require("./user.route"));
routes.use("/v1/auth", require("./login.route"));
routes.use("/v1/store",authorization, require("./store.route"));
routes.use("/v1/product",authorization, require("./product.route"));
routes.use("/v1/delivery",authorization, require("./delivery.route"));
routes.use("/v1/storefront",authorization, require("./storefront.route"));

module.exports = routes;