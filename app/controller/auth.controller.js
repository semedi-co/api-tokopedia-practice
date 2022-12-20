require("dotenv").config()
const loginSchema = require("../validation/login.schema");
const bcrypt = require("bcrypt");
const db =require("../../databases")
const jwt = require("jsonWebToken")
const { Api422Error, Api401Error, Api400Error } = require("../middlewares/errors/ApiErrors");

module.exports = class AuthController {
    static async login(req, res, next){
        try {
            // validte input from body
            const {error,value} = loginSchema.validate(req.body);
            if(error){
                throw new Api422Error("validation eror", error.details);
            } 

            // cheking username
            // authentication 
            const user = await db("users")
                .where({ username: value.username})
                .first()
                .catch(error =>{
                    throw new Api400Error(error.mesagge);
                })
         
        if(!user) {
            throw new Api401Error("username not registred");
        }else if (!bcrypt.compareSync(value.password, user.password)) {
           return res.status(401).json({
                    success: false,
                    message:"wrong password"
                })
            // throw new Api401Error("wrong password");
        }
        // generate token
        const token = jwt.sign({
            id:user.id,
            username: user.username,
            name: user.name
        },process.env.JWT_SECRET_KEY,{
            expiresIn: process.env.JWT_TIME_EXPIRED
        })

        return res.json({
            succes: true,
            mesagge:"user succesfully logged in",
            token
        })

        } catch (error) {
            next(error)
        }
    }
}