const db = require("../../databases");
const storefrontschema = require("../validation/storefront.schema");

const {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api422Error,
} = require("../middleware/errors/ApiErrors");
module.exports = class storefrontcontroller {
  static async create(req, res, next) {
    try {
      //check store
      const user = await db("users").where({ id: req.user.id }).first();
      const data = await db("stores").where({ id: user.store_id }).first();
      if (!data) {
        throw new Api404Error("store not found");
      }
      //validation data
      const { error, value } = storefrontschema.validate(req.body);
      if (error) {
        throw new Api422Error("validation error", error.details);
      }
      const { name } = value;
      //insert ke databases
      await db("storefront").insert({
        name,
        store_id: user.store_id,
      });

      return res.status(201).json({
        success: true,
        message: "storefront successfully added",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getall(req, res, next) {
    try {
      const { page = 1, limit = 25, search = "" } = req.query;
      
      //add data dari database
      const storefront = await db("storefront")
        .select("id", "name", "created_at", "updated_at")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "storefront succesfully retrieved",
        storefront,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getdetail(req, res, next) {
    try {
      const { id } = req.params;

      const storefront = await db("storefront")
        .select("id", "name", "store_id", "created_at", "updated_at")
        .where({ id })
        .first();

      if (!storefront) {
        throw new Api404Error(`storefront with id ${id} not found`);
      }

      return res.json({
        success: true,
        message: "storefront succesfully retrieved",
        storefront,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;

      const storefront = await db("storefront").where({ id }).first();
      if (!storefront) {
        throw new Api404Error(`storefront with id ${id} not found`);
      }

      const { error, value } = storefrontschema.validate(req.body);
      if (error) {
        throw new Api422Error("validation error", error.details);
      }

      const { name } = value;

      await db("storefront")
        .update({
          name,
        })
        .where({ id });

      return res.status(200).json({
        success: true,
        message: "storefront succesfully update",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const storefront = await db("storefront").where({ id }).first();
      if (!storefront) {
        throw new Api404Error(`storefront with id ${id} not found`);
      }

      await db("storefront").del().where({ id });

      return res.status(200).json({
        success: true,
        message: "storefront succesfully delete",
      });
    } catch (error) {
      next(error);
    }
  }
};
