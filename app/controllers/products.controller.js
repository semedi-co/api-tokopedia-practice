const db     = require("../../databases");
const crypto = require("crypto");
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// validation
const productSchema = require("../validation/product.schema");
// errors
const {
  Api400Error,
  Api422Error,
  Api404Error,
} = require("../middlewares/errors/ApiErrors");
// multer
const upload = require("../helpers/multer")("product_image").array("image");
const upload_satu = require("../helpers/multer")("product_image").single("image");

module.exports = class ProductController {
  static async addProduct(req, res, next) {
    upload(req, res, async function (err) {
      try {
        // checking validation upload
        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }
        //get data from body
        const { error, value } = productSchema.validate(req.body);
        // return console.log(value);
        if (error) {
          throw new Api422Error("Validate Error", error.details);
        }

        // store uuid in variable
        const uuid = crypto.randomUUID();
        // get data from body
        const { name, price, stock, description, sold_total, storefront_id } = value;

        const user = await db("users").where({ id: req.user.id }).first();

        await db.transaction(async function (trx) {
          await db("products")
            .transacting(trx)
            .insert({
              id: uuid,
              store_id: user.store_id,
              storefront_id: +storefront_id,
              name,
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
                id: crypto.randomUUID(),
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

  static async getAll(req, res, next) {
    try {
      const { page = 1, limit = 25, search = "" } = req.query;

      const product = await db("products AS p")
        .leftJoin("product_images AS pi", "pi.product_id", "p.id")
        .select(
          "p.id",
          "p.name",
          "p.description",
          "p.price",
          "p.stock",
          "pi.image"
        )
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .groupBy("p.id")
        .where("p.name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "data user successfully retrieved",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      const products = await db("products AS p")
        .leftJoin("product_images AS pi", "pi.product_id", "p.id")
        .select(
          "p.id",
          "p.name",
          "p.description",
          "p.price",
          "p.stock",
          "p.created_at AS created_p",
          "p.updated_at AS updated_p",
          "pi.id AS id_product_image",
          "pi.image",
          "pi.created_at AS created_pi",
          "pi.updated_at AS updated_pi"
        )
        .where({ "p.id": id });

        // return console.log(products[0]);
          if (products[0] == undefined) {
            throw new Api404Error("data not found")
          }

      return res.json({
        success: true,
        message: "data products successfully retrieved",
        products: {
            id: products[0].id,
            name: products[0].name,
            description: products[0].description,
            price: products[0].price,
            stock: products[0].stock,
            images: products.map((e) => {
              return {
                id: e.id_product_image,
                image: req.get("host").concat("/", e.image),
                created_at: e.created_pi,
                updated_at: e.updated_pi,
              }
            }),
            created_at: products[0].created_p,
            updated_at: products[0].updated_p,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      //get data from body
      const { error, value } = productSchema.validate(req.body);
      // return console.log(value);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      // get data from params
      const { id } = req.params;

      // querying data to db
      const product = await db("products").where({ id }).first();
      if (!product) {
        throw new Api404Error(`Product with id ${id} not found`);
      }
      // get data from body
      const { name, price, stock, description, sold_total } = req.body;

      await db.transaction(async function (trx) {
        // update data to products
        await db("products")
          .where({ id })
          .transacting(trx)
          .update({
            name,
            price,
            stock,
            description,
            sold_total,
          })
          .catch(trx.rollback);

        trx.commit;
      });

      return res.json({
        success: true,
        message: "data product successfully updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      // get data from params
      const { id } = req.params;

      // checking available note
      const check = await db("products").where({ id }).first();
      if (!check) {
        throw new Api404Error(`product with ${id} not found`);
      }

      await db("products").where({ id }).del();

      return res.json({
        success: true,
        message: "product successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateImage(req, res, next) {
    upload_satu(req, res, async function (err) {
      try {
        const { id } = req.params;
        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }
        //retrive url or split path
        const pathImage = req.file.path.split("\\");
        const url = pathImage.splice(pathImage.length - 2).join("/");
        // return res.json(url);

        const product_images = await db("product_images").where({ id }).first();
        // return console.log(user.avatar);
        if (product_images.image != null || product_images.image != "") {
          fs.unlinkSync(
            path.join(__dirname, "../../public/".concat(product_images.image))
          );
        }

        await db("product_images")
          .where({ id })
          .update({ image: url })
          .catch((error) => {
            throw new Api400Error(error.message);
          });

        return res.json({
          success: true,
          message: "images successfully changed",
          image: req.get("host").concat("/", url),
        });
      } catch (error) {
        next(error);
      }
    });
  }
};
