require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Api401Error } = require("./errors/ApiErrors");

const { JWT_TOKPED } = process.env;

module.exports = (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        if (typeof token == "undefined" || token == "") {
            throw new Api401Error("Invalid Error");
        }

        jwt.verify(token, JWT_TOKPED, (err, passed) => {
            if (err) {
                throw new Api401Error(err.message);
            }
            req.user = passed;
            next();
        });
    } catch (error) {
        next(error);
    }
};