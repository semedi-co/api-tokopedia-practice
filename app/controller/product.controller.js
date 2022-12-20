require("dotenv").config()
const productSchema = require("../validation/product.schema")
const db = require("../../databases")
const crypto = require("crypto")
const {Api400Error, Api403Error, Api404Error,Api422Error}= require("../middlewares/errors/ApiErrors")
const { message, description, id } = require("../validation/product.schema")
const upload = require("../helper/multer")("product").array("image")
const fs = require("fs")
const multer = require("multer")
const { url } = require("inspector")

module.exports = class ProductController {
    static async addProduct(req, res) {
      upload(req, res, async err => {
        // checking validation upload
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        } else if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        
        const {error, value}= productSchema.validate(req.body)
        if (error) {
            throw new Api422Error("valodation error", error.message)
        }
        // get data from body
        const { name, price,store_front_id, stok, description, sold_total } = value;
  
        // store uuid in variable
        const uuid = crypto.randomUUID();
        const id_store= await db("users").where({id: req.user.id}).first()
  
  
        await db("products")
          .insert({ id: uuid,store_id: id_store.store_id,store_front_id, name, price: +price, stok: +stok, description, sold_total: +sold_total })
          .catch(err => {
            return res.status(400).json({
              success: false,
              message: err.message
            })
          });
  
        req.files.map(async function(d) {
          const pathImages = d.path.split("\\");
          const url = pathImages.splice(pathImages.length - 2).join("/");

          await db("product_image")
            .insert({
              id: crypto.randomUUID(),
              product_id: uuid,
              image: url
            })
            .catch(err => {
              return res.status(400).json({
                success: false,
                message: err.message
              })
            });
        });
  
    })
    return res.status(201).json({
      success: true,
      message: "product successfully added"
    })
    }
    static async getAll(req, res , next){
        try {
            const {page = 1, limit= 15, seacrh="", order="asc"}= req.query


            const product = await db("products as p")
              .leftJoin("product_image as pi", "p.id", "pi.product_id" )
              .select("p.id","p.name","p.stok","p.price","p.description","p.sold_total","pi.image","p.created_at","p.updated_at")
              .limit(+limit)
              .offset(+limit * +page - +limit)
              .orderBy("p.created_at", order)
              .where("name", "like", `%${seacrh}%`)
              .groupBy("p.id")
              

                     return res.json({
                        success: true,
                        message: "get data all successfully",
                        product
                    })
        } catch (error) {
            next(error)
        }
    }
    static async getDetail(req, res, next){
      try {
            const {id}= req.params

           
            const product= await db("products as p")
            .leftJoin("product_image as pi","pi.product_id","p.id")
            .select(
              "p.id",
              "p.name",
              "p.stok",
              "p.price",
              "p.description",
              "p.created_at ",
              "p.updated_at ", 
              "pi.id as id_product_image",
              "pi.image",
              "pi.created_at as created_pi", 
              "pi.updated_at as updated_pi")
            .where({"p.id": id})
            // console.log(product);
           
            if (!product) {
              throw new Api404Error("product not found")
            }

            return res.json({
              success: true,
              message: "product successfully retrieved",
              products: {
                id: product[0].id,
                name: product[0].name,
                description: product[0].description,
                price: product[0].price,
                stock: product[0].stock,
                images: product.map((e) => {
                  return {
                    id: e.id_product_image,
                    image: req.get("host").concat("/", e.image),
                    created_at: e.created_pi,
                    updated_at: e.updated_pi,
                  }
                }),
                created_at: product[0].created_p,
                updated_at: product[0].updated_p,
            }
          });
              
            

      } catch (error) {
        next(error)
      }
    }
    static async updateData(req, res, next){
     try {
        const {id} = req.params
        const {error, value}= productSchema.validate(req.body)
        if (error) {
          throw new Api422Error("validation error", error.details)
        }
        const product = await db("products").where({id}).first()
        if (!product) {
          throw new Api404Error("product not found")
        }
        const {name, description, stok, price, sold_total}=value

        await db("products")
        .update({
          name,
          description,
          stok,
          price,
          sold_total
        })
        .catch(err =>{
          return res.status(400).json({
            success: false,
            message: err.message
          })

        })
        return res.json({
          success: true,
          message: "updated successfully retrieved"
        })
     } catch (error) {
      next(error)
     } 
    }
    static async deleteProduct(req, res, next){
      try {
        const {id}= req.params;

        const product = await db("products").where({id}).first()
        if (!product) {
          throw new Api422Error("validation error")
        }
        await db("products")
            .where({id})
            .del()


        return res.json({
          success: true,
          message: "dalete successfully retrieved"
        })

      } catch (error) {
        next(error)
      }
    }
  }