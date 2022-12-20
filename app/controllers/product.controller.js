const db = require("../../databases");
const productschema = require("../validation/product.schema");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const patch = require("path");

const upload = require("../helpers/multer")("product").array("image");

const {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api422Error,
} = require("../middleware/errors/ApiErrors");

module.exports = class productcontroller {
  static async create(req, res, next) {
    upload(req, res, async function (err) {
      try {
        //checking store
        const idstore = await db("users").where({ id: req.user.id }).first();
        const data = await db("stores").where({ id: idstore.store_id }).first();
        if (!data) {
          throw new Api404Error("store not found");
        }
        // checking validation upload
        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }
        //get data from body
        const { error, value } = productschema.validate(req.body);
        // return console.log(value);
        if (error) {
          throw new Api422Error("Validate Error", error.details);
        }
        // uuid in variable
        const uuid = crypto.randomUUID();
        // get data from body
        const { name, price, stock, description, sold_total, storefront_id } = value;

        await db.transaction(async function (trx) {
          const product = await db("products")
            .transacting(trx)
            .insert({
              id: uuid,
              store_id: idstore.store_id,
              name,
              storefront_id,
              price: +price,
              stock: +stock,
              description,
              sold_total: +sold_total,
            })
            .catch(trx.rollback);

          req.files.map(async function (d) {
            const pathImages = d.path.split("\\");
            const url = pathImages.splice(pathImages.length - 2).join("/");

            await db("product_images")
              .transacting(trx)
              .insert({
                product_id: uuid,
                image: url,
              })
              .catch(trx.rollback);
          });

          trx.commit;
        });
        return res.status(201).json({
          success: true,
          message: "product successfully added",
        });
      } catch (error) {
        next(error);
      }
    });
  }

  static async getall(req, res, next) {
    try {
      const { page = 1, limit = 25, order = "asc", search = "" } = req.query;

      const product = await db("products AS p")
        .leftJoin("product_images AS pi", "p.id", "pi.product_id")
        .select(
          "p.id",
          "p.name",
          "p.store_id",
          "p.price",
          "pi.image",
          "p.created_at",
          "p.updated_at"
        )
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .where("p.name", "like", `%${search}%`)
        .groupBy("p.id");

      return res.json({
        success: true,
        message: "data product successfully retrieved",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getdetails(req, res, next) {
    try {
      const { id } = req.params;
      const pro = await db("products").where({ id }).first();
      // querying data from db
      const products = await db("products AS p")
        .leftJoin("product_images AS pi", "pi.product_id", "p.id")
        .select(
          "p.id",
          "p.name",
          "p.stock",
          "p.price",
          "p.description",
          "p.created_at",
          "p.updated_at",
          "pi.id AS pid",
          "pi.image",
          "pi.created_at AS pic",
          "pi.updated_at AS piu"
        )
        .where({ "p.id": id });

      //cek available product
      if (!pro) {
        throw new Api404Error(`product not found`);
      }

      return res.json({
        success: true,
        message: "data successfully retrieved",
        product: products.map((d) => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            price: d.price,
            stock: d.stock,
            images: products.map((e) => {
              return {
                id: e.pid,
                url: req.get("host").concat("/", e.image),
                created_at: e.pic,
                updated_at: e.piu,
              };
            }),
            created_at: d.created_at,
            updated_at: d.updated_at,
          };
        })[0],
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateproduct(req, res, next) {
    try {
      const { id } = req.params;
      //get data from body
      const { error, value } = productschema.validate(req.body);
      // return console.log(value);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      const data = await db("products").where({ id }).first();
      if (!data) {
        throw new Api404Error("product id not found");
      }

      const { name, price, stock, description, sold_total } = value;
      await db("products").where({ id }).update({
        name,
        price,
        stock,
        description,
        sold_total,
      });

      return res.status(200).json({
        success: true,
        message: "Succes update product",
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateavatar(req, res, next) {
    upload(req, res, async function (err) {
      try {
        const { id } = req.params;
        const idstore = await db("users").where({ id: req.user.id }).first();
        const data = await db("stores").where({ id: idstore.store_id }).first();

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

        fs.unlinkSync(
          patch.join(__dirname, "../../public/".concat(store.avatar))
        );
        
        await db("product_images").where({ id }).insert({});

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
      const { id } = req.params;

      const data = await db("products").where({ id }).first();

      if (!data) {
        throw new Api404Error(`product not found`);
      } else {
        await db("products").del().where({ id });

        return res.status(200).json({
          status: true,
          message: "Succes delete store",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteimage(req, res, next) {
    try {
      const { id } = req.params;

      const image = await db("product_images").where({ id }).first();

      if (!image) {
        throw new Api404Error(`product image not found`);
      } else {
        await db("product_images").del().where({ id });
        fs.unlinkSync(
          patch.join(__dirname, "../../public/".concat(image.image))
        );

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
