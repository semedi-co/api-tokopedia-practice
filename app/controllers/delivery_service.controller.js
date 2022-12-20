const db = require("../../databases");

// validation
const deliveryServiceSchema = require("../validation/delivery_service.schema");
// errors
const { Api404Error, Api422Error } = require("../middlewares/errors/ApiErrors");

module.exports = class StorefrontController {
  static async create(req, res, next) {
    try {
      //get data from body
      const { error, value } = deliveryServiceSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }
      const { store_id } = req.params;
      const { name } = value;
      await db.transaction(async function (trx) {
        //insert user
        await db("delivery_service")
          .transacting(trx)
          .insert({ store_id, name })
          .catch(trx.rollback);

        trx.commit;
      });

      return res.status(201).json({
        success: true,
        message: "data delivery service successfully created",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "", order = "asc" } = req.query;

      const delivery_service = await db("delivery_service")
        .select("id", "name", "created_at", "updated_at")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .orderBy("created_at", order)
        .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "data delivery service successfully retrieved",
        delivery_service,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const id = req.params.id;

      const delivery_service = await db("delivery_service")
        .select("id", "name", "created_at", "updated_at")
        .where({ id })
        
      return res.json({
        success: true,
        message: "data delivery service successfully retrieved",
        delivery_service: delivery_service.map((d) => {
          return {
            id: d.id,
            name: d.name,
            created_at: d.created_at,
            updated_at: d.updated_at
          }
        })[0]
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      //get data from body
      const { error, value } = deliveryServiceSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      const { id } = req.params;
      const check = await db("delivery_service").where({ id }).first();
      if (!check) {
        throw new Api404Error("delivery service is not found");
      }

      const { name } = value;

      await db.transaction(async function (trx) {
        //update data note
        await db("delivery_service")
          .where({ id })
          .transacting(trx)
          .update({ name })
          .catch(trx.rollback);

        trx.commit;
      });
      return res.json({
        success: true,
        message: "delivery service successfully updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const check = await db("delivery_service").where({ id }).first();

      if (!check) {
        throw new Api404Error(`delivery service with ${id} not found`);
      }

      await db("delivery_service").where({ id }).del();

      return res.json({
        success: true,
        message: "delivery service successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
