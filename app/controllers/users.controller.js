const db = require("../../databases");
const userschema = require("../validation/user.schema");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const patch = require("path");

const upload =require("../helpers/multer")("user").single("avatar");

const {Api400Error,Api401Error,Api403Error,Api404Error,Api422Error} = require("../middleware/errors/ApiErrors");

module.exports = class usercontroller{
  static async create(req,res,next){
   try {

    const {error,value} = userschema.validate(req.body);
    if (error) {
      throw new Api422Error("validate data error", error.details);
    }
    
    const {name,email,password}= value;
    // check email
    const mail = await db("users").where({}).first();

    if (mail == email) {
      
    }
 
    await db("users").insert({
      id: crypto.randomUUID(),
      name,
      email,
      password: bcrypt.hashSync(password,10)
    })
    return res.status(201).json({
      success: true,
      message:"user successfully added",
    })
  
   } catch (error) {
    next(error) 
   }
  }

  static async getall(req,res,next){
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "" } = req.query;

      const users = await db("users")
      .select("id","name","email","created_at","updated_at")
      .limit(+limit)
      .offset(+limit * +page - +limit)
      .where("name", "like", `%${search}%`);


      return res.json({
        success: true,
        message:"data user successfully retrieved",
        users
      })
    } catch (error) {
      next(error);
    }
  }

  static async getdetails(req,res,next){
    try {

      // querying data from db
      const users = await db("users as u")
        .leftJoin("stores as s", "s.id", "u.store_id")
        .select(
          "u.id", 
          "u.email", 
          "u.name as nama", 
          "u.avatar as profil", 
          "u.store_id",
          "s.name",
          "s.address",
          "s.avatar",
          "u.created_at", 
          "u.updated_at")
        .where({"u.id": req.user.id})
        

      //cek available user
      if (!users) {
          throw new Api404Error(`User with id  not found`);
      }

      return res.json({
          success: true,
          message: "data successfully retrieved",
          user: users.map((d) => {
            return{
              id: d.id,
              email: d.email,
              nama: d.nama,
              profil: d.profil,
              Toko: d.store_id == null ? "Belum Punya Toko" : {
                id_toko: d.store_id,
                toko: d.name,
                alamat: d.address,
                foto_toko: d.avatar,
              },
              created_at: d.created_at,
              updated_at: d.updated_at
            };
          }),
      });
  } catch (error) {
      next(error);
  }
  }

  static async update(req,res,next){
    try {

      const data = await db("users").where({ id: req.user.id }).first();
      
      const {error,value} = userschema.validate(req.body);

    if (error) {
      throw new Api422Error("validate data error", error.details);
      
    }
      const { email, password, name } = value;

      if (!data) {
          throw new Api404Error(`User with id ${id} not found`);
      } else {
          await db("users")
              .update({
                  email,
                  password: bcrypt.hashSync(password, 10),
                  name
              })
              .where({ id: req.user.id });

          return res.status(200).json({
              status: true,
              message: "Succes update user",
          });
      }
  } catch (error) {
      next(error);
  }
  }

  static async updateavatar(req,res,next){
    upload(req, res, async function (err) {
      try {
        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }
        // return res.json(req.file);

        //retrive url orsplit path
        const pathAvatar = req.file.path.split("\\");
        const url = pathAvatar.splice(pathAvatar.length - 2).join("/");

        const user = await db("users").where({ id: req.user.id }).first();
        if (user.avatar != null) {
          fs.unlinkSync(patch.join(__dirname, "../../public/".concat(user.avatar)));
        }

        await db("users")
          .where({ id: req.user.id })
          .update({ avatar: url })
          .catch((error) => {
            throw new Api400Error(error.message);
          });

        return res.json({
          success: true,
          message: "avatar succesfully changed",
          avatar: req.get("host").concat("/", url),
        });
      } catch (error) {
        next(error);
      }
    });
  }

  static async deleteimage(req,res,next){
    try {
      
      const data = await db("users").where({ id: req.user.id }).first();
      if (!data) {
          throw new Api404Error(`User with id ${id} not found`);
      } 
      await db("users").where({id: req.user.id}).update({avatar: null});
      fs.unlinkSync(patch.join(__dirname, "../../public/".concat(data.avatar)));


      return res.status(200).json({
        status: true,
        message: "Succes delete data user",
    });
    } catch (error) {
      next(error);
    }
  }
  
  static async delete(req,res,next){
    try {
      
      const data = await db("users").where({ id: req.user.id }).first();
      if (!data) {
          throw new Api404Error(`User with id ${id} not found`);
      } else if(data.store_id == null) {
          await db("users").del().where({ id: req.user.id });
          return res.status(200).json({
              status: true,
              message: "Succes delete data user",
          });
      } else{
        await db("users").del().where({ id: req.user.id });
        await db("stores").del().where({id: data.store_id});
        return res.status(200).json({
            status: true,
            message: "Succes delete data user",
        });
      }
    } catch (error) {
      next(error);
    }
  }
};