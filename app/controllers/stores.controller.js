const db     = require("../../databases");
const crypto = require("crypto");
const multer = require("multer");
const fs     = require("fs");
const path   = require("path");

// validation 
const storesSchema = require("../validation/store.schema");
// errors 
const { Api422Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");
// multer 
const upload = require("../helpers/multer")("store").single("avatar");

module.exports = class StoresController {
  static async create(req, res, next) {
    try {
      //get data from body
      const { error, value } = storesSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }
      const id = crypto.randomUUID();
      const { name, address } = value;
      await db.transaction(async function (trx) {
        //insert user
        await db("stores")
          .transacting(trx)
          .insert({ id, name, address })
          .catch(trx.rollback);

        trx.commit;
      });

      const id_user = req.user.id;
      const data = await db("users").where({ id: id_user }).first();
      if (!data) {
        throw new Api404Error(`User with id ${id_user} not found`);
      }

      await db("users")
        .update({
          store_id: id,
        })
        .where({ id: id_user });

      return res.status(201).json({
        success: true,
        message: "data store successfully created",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "", order = "asc" } = req.query;

      const stores = await db("stores")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .orderBy("created_at", order)
        .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "data stores successfully retrieved",
        stores,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      //get data from body
      const { error, value } = storesSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      const { id } = req.params;
      const store = await db("stores").where({ id }).first();
      if (!store) {
        throw new Api404Error("Store is not found");
      }

      const { name, address } = value;

      await db.transaction(async function (trx) {
        //update data note
        await db("stores")
          .where({ id })
          .transacting(trx)
          .update({ name, address })
          .catch(trx.rollback);

        trx.commit;
      });
      return res.json({
        success: true,
        message: "Store successfully update",
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const store = await db("stores").where({ id }).first();

      if (!store) {
        throw new Api404Error(`Store with ${id} not found`);
      }

      await db("stores")
      .where({ id })
      .del();

      return res.json({
        success: true,
        message: "Store successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async ChangeAvatar(req, res, next) {
    upload(req, res, async function (err) {
      try {
        const idStore = await db("users").where({ id: req.user.id }).first();
        const data = await db("stores").where({ id: idStore.store_id }).first();

        if (!data) {
          throw new Api404Error("Store not found");
        }

        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }
        //retrive url or split path
        const pathAvatar = req.file.path.split("\\");
        const url = pathAvatar.splice(pathAvatar.length - 2).join("/");
        // return res.json(url);
  
        const store = await db("stores").where({ id: data.id }).first();
        // return console.log(store.avatar);
        if (store.avatar != null) {
          fs.unlinkSync(
            path.join(__dirname, "../../public/".concat(store.avatar))
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
          message: "avatar successfully changed",
          avatar: req.get("host").concat("/", url),
        });
      } catch (error) {
        next(error);
      }
    });
  }

  static async deleteAvatar(req, res, next) {
    try {
      const { id } = req.params;
      const store = await db("stores").where({ id }).first();
      fs.unlinkSync(path.join(__dirname, "../../public/".concat(store.avatar)));

      await db("stores")
        .where({ id })
        .update({ avatar: null })
        .catch((error) => {
          throw new Api400Error(error.message);
        });

      return res.json({
        success: true,
        message: "avatar successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
