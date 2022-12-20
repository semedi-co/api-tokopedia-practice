require("dotenv").config();
const loginSchema = require("../validation/login.schema");
const registerSchema = require("../validation/register.schema");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../../databases");
const jwt = require("jsonwebtoken");

const { Api422Error, Api401Error, Api400Error } = require("../middlewares/errors/ApiErrors");

module.exports = class AuthController {
    static async register(req, res, next) {
        try {
            //get data from body
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                throw new Api422Error("Validate Error", error.details);
            }

            const { name, username, password } = value;

            //insert data to db
            await db("users").insert({
                id: crypto.randomUUID(),
                name,
                username,
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

    static async login(req, res, next) {
        try {
            //validate input from input
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                throw new Api422Error("Validate Error", error.details);
            }

            //checking username dan password
            //authentication
            const user = await db("users")
                .where({ username: value.username })
                .first()
                .catch((error) => {
                    throw new Api400Error(error.message);
                });

            if (!user) {
                throw new Api401Error("username not registered");
            } else if (!bcrypt.compareSync(value.password, user.password)) {
                throw new Api401Error("wrong password");
            }

            //generate token
            const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                },
                process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_SECRET_EXPIRED,
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