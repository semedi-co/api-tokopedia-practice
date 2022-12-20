require("dotenv").config()
const { Api422Error, Api400Error, Api404Error } = require("../middlewares/errors/ApiErrors")
const deliverySchema = require("../validation/delivery.schema")
const db= require("../../databases")

module.exports = class deliveryController{
    static async createData(req, res , next){
        try {
            const {error, value}= deliverySchema.validate(req.body)
            if (error) {
                throw new Api422Error("validation error", error.details)
            }

            const {store_id,name}= value
            

            await db("delivery_sevice")
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

          const delivery =  await db("delivery_sevice")
                .select("delivery_sevice.id", "delivery_sevice.name","delivery_sevice.store_id","delivery_sevice.created_at","delivery_sevice.updated_at")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .where("delivery_sevice.name", "like", `%${seacrh}%`)

                if (!delivery) {
                    throw new Api404Error(`storefront by ${id} not found`)
                }

            return res.json({
                success: true,
                delivery
            })
            
        } catch (error) {
            next(error)
        }
    }
    static async getDetail(req, res, next){
        try {
            const {id} = req.params

            const delivery =  await db("delivery_sevice")
            .where({id})
            .first()

            if (!delivery) {
                throw new Api404Error("user not found")
            }

            return res.json({
                success: true,
                message: "get datail successfully",
                delivery
            })
            } catch (error) {
                next(error)
            }
    }
    static async updateSf(req, res, next){
        try {
                const {error, value}=  deliverySchema.validate(req.body)
            if (error) {
                throw new Api422Error("validation error")
            }
            const {id}= req.params
            const sf= await db("delivery_sevice").where({id}).first()
            if (!sf) {
                throw new Api404Error("not found")
            }
            const {name}= value
            await db("delivery_sevice")
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
        static async delete(req, res, next){
            try {
                const {id} = req.params
    
                const sf = await db("delivery_sevice")
                .where({id})
                .first()
    
                if (!sf) {
                    throw new Api422Error("validation error", error.message)
                }
                await db("delivery_sevice")
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