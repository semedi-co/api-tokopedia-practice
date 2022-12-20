const db = require("../../databases");
const storeschema = require("../validation/store.schema");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const patch = require("path");

const upload = require("../helpers/multer")("store").single("avatar");

const {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api422Error,
} = require("../middleware/errors/ApiErrors");


module.exports = class storecontroller {
  static async create(req,res,next) {
    try {

      const {error,value} = storeschema.validate(req.body);
      // return console.log(value);
      if (error) {
        throw new Api422Error("validate error", error.details);
      }
      
      const {name,address}= value;
      const store = crypto.randomUUID();

      await db.transaction(async function(trx){
        await db("stores")
          .transacting(trx)
          .insert({
            id: store,
            name,
            address
          })
          .catch(trx.rollback);

        await db("users")
          .transacting(trx)
          .where({id: req.user.id})
          .update({
            store_id: store
          })
          .catch(trx.rollback);

        trx.commit;
      })

      return res.status(201).json({
        success: true,
        message: "data store successfully created"
      });

    } catch (error) {
      next(error);
    }
  }

  static async getall(req,res,next){
    try {

      const { page = 1, limit = 25, order = "asc", search = "" } = req.query;

      const toko = await db("stores")
      .select("id","name","address","avatar","created_at","updated_at")
      .limit(+limit)
      .offset(+limit * +page - +limit)
      .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message:"data store successfully retrieved",
        toko
      })
    } catch (error) {
      next(error);
    }
  }

  static async getdetails(req, res, next) {
    try {
      const idstore = await db("users").where({id:req.user.id}).first();

      // querying data from db
      const store = await db("stores")
        .select("id", "name", "avatar", "address", "created_at", "updated_at")
        .where({ id: idstore.store_id })
        .first();

      //cek available store
      if (!store) {
        throw new Api404Error(`store not found`);
      }

      return res.json({
        success: true,
        message: "data successfully retrieved",
        store,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { error, value } = storeschema.validate(req.body);
      if (error) {
        throw new Api422Error("validate error", error.details);
      }
      const { name, address } = value;
      const idstore = await db("users").where({id: req.user.id}).first();
      const data = await db("stores").where({id: idstore.store_id}).first();

      if (!data) {
        throw new Api404Error(`store not found`);
      } else {
        await db("stores")
          .update({
            name,
            address,
          })
          .where({ id: data.id});

        return res.status(200).json({
          status: true,
          message: "Succes update store",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateavatar(req, res, next) {
    upload(req, res, async function (err) {
      try {
        const idstore = await db("users").where({id: req.user.id}).first();
        const data = await db("stores").where({id: idstore.store_id}).first();
  
        if (!data) {
          throw new Api404Error(`store not found`);
        }

        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }


        //retrive url orsplit path
        const pathAvatar = req.file.path.split("\\");
        const url = pathAvatar.splice(pathAvatar.length - 2).join("/");

        const store = await db("stores")
          .where({ id: data.id })
          .first();
        if (store.avatar != null) {
          fs.unlinkSync(
            patch.join(__dirname, "../../public/".concat(store.avatar))
          );
        }

        await db("stores")
          .where({ id: data.id })
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

  static async delete(req, res, next) {
    try {
      // const{id} = req.params;
      const idstore = await db("users").where({id:req.user.id}).first();

      if (!idstore.store_id) {
        throw new Api404Error(`store not found`);
      } else {
        await db("stores").del().where({ id: idstore.store_id});

        return res.status(200).json({
          status: true,
          message: "Succes delete store",
        });
      }
    } catch (error) {
      next(error);
    }
  }
};
