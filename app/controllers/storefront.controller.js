const db = require("../../databases");

// validation
const storefrontSchema = require("../validation/storefront.schema");
// errors
const { Api404Error, Api422Error } = require("../middlewares/errors/ApiErrors");

module.exports = class StorefrontController {
  static async create(req, res, next) {
    try {
      //get data from body
      const { error, value } = storefrontSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }
      const { store_id } = req.params;
      const { name } = value;
      await db.transaction(async function (trx) {
        //insert user
        await db("storefront")
          .transacting(trx)
          .insert({ store_id, name })
          .catch(trx.rollback);

        trx.commit;
      });

      return res.status(201).json({
        success: true,
        message: "data storefront successfully created",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "", order = "asc" } = req.query;

      const storefront = await db("storefront")
      .select("id", "name", "created_at", "updated_at")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .orderBy("created_at", order)
        .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "data storefront successfully retrieved",
        storefront,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const id = req.params.id;
      const storefront = await db("storefront AS s")
        .leftJoin("products AS p", "p.storefront_id", "s.id")
        .select(
          "s.id",
          "s.name",
          "s.created_at",
          "s.updated_at",
          "p.id AS id_product",
          "p.name AS name_product",
          "p.price",
          "p.stock",
          "p.description"
        )
        .where({ "s.id": id })
        .first()

      if (storefront == undefined) {
        throw new Api404Error("data not found");
      }

      return res.json({
        success: true,
        message: "data storefront successfully retrieved",
        storefront: {
          id: storefront[0].id,
          name: storefront[0].name,
          products: storefront.map((e) => {
            return {
              id: e.id_product,
              name: e.name_product,
              price: e.price,
              stock: e.stock,
              description: e.description,
            };
          }),
          created_at: storefront[0].created_at,
          updated_at: storefront[0].updated_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      //get data from body
      const { error, value } = storefrontSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      // check availeble storefront 
      const { id } = req.params;
      const check = await db("storefront").where({ id }).first();
      if (!check) {
        throw new Api404Error("storefront is not found");
      }

      const { name } = value;

      await db.transaction(async function (trx) {
        //update data note
        await db("storefront")
          .where({ id })
          .transacting(trx)
          .update({ name })
          .catch(trx.rollback);

        trx.commit;
      });
      return res.json({
        success: true,
        message: "storefront successfully updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const check = await db("storefront").where({ id }).first();

      if (!check) {
        throw new Api404Error(`storefront with ${id} not found`);
      }

      await db("storefront").where({ id }).del();

      return res.json({
        success: true,
        message: "storefront successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
