require("dotenv").config()
const crypto = require("crypto")
const storeSchema = require("../validation/store.schema")
const db = require("../../databases")
const {Api400Error, Api403Error, Api404Error,Api422Error}= require("../middlewares/errors/ApiErrors")
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const upload =require("../helper/multer")("store").single("image")

module.exports = class storeController{
    static async createStore(req, res, next){
        try {
            const {error, value} =  storeSchema.validate(req.body)
            if (error) {
                throw new Api422Error("validation error",error.message)
            }
            const {name, address}= value
            const id_store = crypto.randomUUID()
            await db("stores")
                .insert({
                    id :id_store,
                    name,
                    address
                })
                await db("users")
                    .update({
                        store_id: id_store
                    })
                    .where({id : req.user.id})
                .catch(err =>{
                    return res.status(400).json({
                        success:false,
                        message: err.message
                    })
                })

            return res.json({
                success:true,
                message: "create store successfully"
            })
        } catch (error) {
            next(error)
        }
    }
    static async getAll(req, res, next){
        try {
          const {page = 1, limit= 15, seacrh=""}= req.query

          const user = await db("stores")
            .select("id","name","address","avatar")
            .limit(+limit)
            .offset(+limit * +page - +limit)
            .where("name", "like", `%${seacrh}`)

            return res.json({
                success: true,
                message: "get stores successfully",
                user
            })
        } catch (error) {
            next(error)
        }
    }
    static async getDetail(req, res, next){
        try {
            const {id} = req.params

            const user=  await db("stores")
            .where({id})
            .first()

            if (!user) {
                throw new Api404Error("user not found !!")
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
    static async updateStore(req, res, next){
        try {
            const {error, value}= storeSchema.validate(req.body)
            if (error) {
                throw new Api422Error("validation error", error.message)
            }
            const {id} = req.params

            const store= await db("stores").where({id}).first()
            if (!store) {
                throw new Api404Error("store not found")
            }
            const{name, address}= value
            await db("stores")
            .update({
                name,
                address
            })
            .catch(err => {
                return res.status(400).json({
                    success: false,
                    message:err.message
                })

            })
            return res.json({
                success: true,
                message: "stores successfully updated"
            })
        } catch (error) {
            next(error)
        }
    }
    static async addImage(req, res, next){
        upload(req, res, async function(err){
            try {
                const { id } = req.params;
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
                const pathAvatar = req.file.path.split("\\")
                const url = pathAvatar.splice(pathAvatar.length - 2).join("/")

                const store = await db("stores").where({ id }).first();
                if (store.avatar != null) {
                    fs.unlinkSync(path.join(__dirname, "../../public".concat(store.image)))
                }
                

                await db("stores")
                    .where({id: store.id})
                    .update({avatar: url})
                    .catch(err=>{
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    })
                })

                return res.json({
                    success:true,
                    message:"image successfully changed",
                    image: req.get("host").concat("/",url)
                })
            } catch (error) {
                next(error)
            }
        })
    }
    static async deleteStore(req, res, next){
        try {
            const { id }= req.params

            const user = await db("stores").where({id}).first()
            if (!user) {
                throw new Api422Error("validation error")
            }
            await db("stores")
                .where({id})
                .del()


            return res.json({
                success: true,
                message: "delete successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}
