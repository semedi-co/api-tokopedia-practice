require("dotenv").config();
const loginschema = require("../validation/login.schema");
const bcrypt = require("bcrypt");
const db = require("../../databases");
const jwt = require("jsonwebtoken");

const {
  Api401Error,
  Api422Error,
  Api400Error,
} = require("../middleware/errors/ApiErrors");

module.exports = class logincontroller {
  static async login(req, res, next) {
    try {
      //validate input from input
      const { error, value } = loginschema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      //checking email dan password
      //authentication
      const user = await db("users")
        .where({ email: value.email })
        .first()
        .catch((error) => {
          throw new Api400Error(error.message);
        });

      if (!user) {
        throw new Api401Error("email not registered");
      } else if (!bcrypt.compareSync(value.password, user.password)) {
        throw new Api401Error("wrong password");
      }

      //generate token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_TOKPED,
        {
          expiresIn: process.env.JWT_EXPIRED,
        }
      );

      return res.json({
        success: true,
        message: "user successfully logged in",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
};
