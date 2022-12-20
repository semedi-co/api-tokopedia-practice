require("dotenv").config()
const crypto = require("crypto")
const bcrypt= require("bcrypt")
const userSchema = require("../validation/user.schema.js")
const db = require("../../databases")
const{Api400Error,Api403Error, Api404Error, Api422Error}= ("../middlewares/errors/apiError.js")
const upload = require("../helper/multer")("user").single("avatar")
const multer = require("multer")
const fs = require("fs")
const path = require("path")


module.exports = class userController{
    static async createUser(req, res, next){
        try {
            const {error, value} = userSchema.validate(req.body);
            if (error) {
                // throw new Api422Error("validation error")
            return res.status(422).json({
                success: false,
                message: error.message
            })
            }
            const {name,username,password}= value
          
                // insert to db
                await db("users")
                    .insert({
                        id:crypto.randomUUID(),
                        name,
                        username,
                        password: bcrypt.hashSync(password, 10)
                    })
                    .catch(err =>{
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    })
                        // throw new Api400Error(err)
                    })
                    
            return res.json({
                success: true,
                message: "data successfully retrived"
            })
            
        } catch (error) {
            next(error)
        }
    }
    static async getAll(req, res, next){
        try {
           const {page = 1 , limit = 15, search= ""}= req.query;
           
           const user =await db("users")
                .select("id", "name","store_id","username", "created_at", "updated_at")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .where("username", "like", `%${search}%`)

                return res.json({
                    success: true,
                    messages: "get data successfully",
                    user
                })
        } catch (error) {
            next(error)
        }
    }
    static async getDetail(req, res, next){
        try {
            const {id} = req.params

        const user =  await db("users")
        .where({id})
        .first()

        if (!user) {
            throw new Api404Error("user not found")
        }

        return res.json({
            success: true,
            message: "get datail successfully",
            user
        })
        } catch (error) {
            next(error)
        }
    }
    static async updateUser(req, res, next){
        try {
            const {error,value}= userSchema.validate(req.body)
            if (error) {
                throw new Api422Error("validateion error", err.message)
                
            }
            const { id }= req.params;

            const {name, username, password}= value;

            const user =await db("users")
            .where({id: id})
            .first()
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
                // throw new Api404Error(`id whit user ${id} is not found`)
            }
            await db("users")
                .where({id})
                .update({
                    name,
                    username,
                    password: bcrypt.hashSync(password, 10)
                })
                .catch(err =>{
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    })
                })


                return res.status(201).json({
                    success: true,
                    message: "update succesfully "
                })
            
        } catch (error) {
            next(error)
        }
    }
    static async deleteUser(req, res, next){
        try {
            const {id} = req.params

            const user = await db("users")
            .where({id})
            .first()

            if (!user) {
                throw new Api422Error("VALIDATION ERROR", error.message)
            }
            await db("users")
                .where({id})
                .del()


            return res.status(201).json({
                success: true,
                message: "delete successfully"
            })
        } catch (error) {
            next(error)
        }
    }
    static async addAvatar(req, res, next){
        upload(req, res, async function(err){
            try {
                if (err instanceof multer.MulterError){
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    })
                } else if(err){
                    return res.status(400).json({
                        success: false,
                        message:err 
                    })
                }

                // relative url or split path
                const pathAvatar =req.file.path.split("\\")
                const url = pathAvatar.splice(pathAvatar.length - 2).join("/")

                // return res.json(url)
                const user =await db("users").where({id : req.user.id}).first()
                if (user.avatar != null) {
                    fs.unlinkSync(path.join(__dirname, "../../public".concat(user.avatar)))
                }

                await db("users")
                .where({id: req.user.id})
                .update({avatar: url})
                .catch(err=>{
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    }) 
                })

                return res.json({
                    success:true,
                    message:"avatar successfully changed",
                    avatar: req.get("host").concat("/",url)
                })
            } catch (error) {
                next(error)
            }
        })
    }
    static async deleteAvatar(req, res, next){
        try {
            const user = await db("users").where({id : req.user.id}).first()
            if (!user) {
                throw new Api404Error(`user id with ${id} is not found `)
            }

            await db("users").where({id: req.user.id}).update({avatar: null})
            fs.unlinkSync(path.join(__dirname, "../../public".concat(user.avatar)));


            return res.json({
                success: true,
                message: "delete successfully retrieved"
            })
        } catch(error) {
            next(error)
        }
    }
}