require("dotenv").config()
const { Api422Error, Api400Error, Api404Error } = require("../middlewares/errors/ApiErrors")
const storefrontSchema = require("../validation/storefront.schema")
const db= require("../../databases")

module.exports = class storeFrontController{
    static async createSf(req, res , next){
        try {
            const {error, value}= storefrontSchema.validate(req.body)
            if (error) {
                throw new Api422Error("validation error", error.details)
            }

            const {store_id, name}= value
            

            await db("store_front")
                .insert({
                    store_id,
                    name
                })
                .catch(err=>{
                    throw new Api400Error(err)
                })

            return res.json({
                succes: true,
                message: "create data successfully"
            })
        } catch (error) {
            next(error)
        }
    }
    static async getAll(req, res ,next){
        try {
            const {page = 1, limit = 25, seacrh= ""}=req.query

          const sf =  await db("store_front  ")
                .select("store_front.id", "store_front.name","store_front.store_id","store_front.created_at","store_front.updated_at")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .where("store_front.name", "like", `%${seacrh}%`)

                if (!sf) {
                    throw new Api404Error(`storefront by ${id} not found`)
                }

            return res.json({
                success: true,
                message: "get data successfully",
                sf
            })
            
        } catch (error) {
            next(error)
        }
    }
    static async getDetail(req, res, next){
        try {
            const {id} = req.params

            const sf =  await db("store_front")
            .where({id})
            .first()

            if (!sf) {
                throw new Api404Error("user not found")
            }

            return res.json({
                success: true,
                message: "get datail successfully",
                sf
            })
            } catch (error) {
                next(error)
            }
    }
    static async updateSf(req, res, next){
    try {
            const {error, value}=  storefrontSchema.validate(req.body)
        if (error) {
            throw new Api422Error("validation error")
        }
        const {id}= req.params
        const sf= await db("store_front").where({id}).first()
        if (!sf) {
            throw new Api404Error("not found")
        }
        const {name}= value
        await db("store_front")
                .update({
                    name 
                })
                .catch(err=>{
                    throw new Api400Error(err)
                })

            return res.json({
                success: true,
                message: "update sucessfully retrieved"
            })
    } catch (error) {
        next(error)
    }
    }   
    static async deleteSf(req, res, next){
        try {
            const {id} = req.params

            const sf = await db("store_front")
            .where({id})
            .first()

            if (!sf) {
                throw new Api422Error("validation error", error.message)
            }
            await db("store_front")
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
}
