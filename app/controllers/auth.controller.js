require("dotenv").config();
const db     = require("../../databases");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt    = require("jsonwebtoken");

// validation
const loginSchema     = require("../validation/login.schema");
const registerSchema  = require("../validation/register.schema");
// errors
const {
  Api422Error,
  Api401Error,
  Api400Error,
} = require("../middlewares/errors/ApiErrors");

module.exports = class AuthController {
  static async login(req, res, next) {
    try {
      // validate input from body
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        throw new Api422Error("validation error", error.details);
      }

      // checking email dan password
      // authentication
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
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_TIME_EXPIRED,
        }
      );

      return res.json({
        success: true,
        message: "users successfully logged in",
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      //get data from body
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      const { name, email, password } = value;

      //insert data to db
      await db("users").insert({
        id: crypto.randomUUID(),
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      });

      return res.status(201).json({
        success: true,
        message: "data users successfully register",
      });
    } catch (error) {
      next(error);
    }
  }
};
