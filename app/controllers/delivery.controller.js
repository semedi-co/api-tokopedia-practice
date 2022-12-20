const db = require("../../databases");
const deliveryschema = require("../validation/delivery.schema");
const {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api422Error,
} = require("../middleware/errors/ApiErrors");

module.exports = class deliverycontroller {
  static async create(req, res, next) {
    try {
      const user = await db("users").where({ id: req.user.id }).first();
      const data = await db("stores").where({ id: user.store_id }).first();
      if (!data) {
        throw new Api404Error("store not found");
      }

      const { error, value } = deliveryschema.validate(req.body);
      // return console.log(value);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }
      const { name } = value;
      await db("delivery_service").insert({
        name,
        store_id: user.store_id,
      });

      return res.status(201).json({
        success: true,
        message: "delivery succesfully added",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getall(req, res, next) {
    try {
      const { page = 1, limit = 25, search = "" } = req.query;

      const delivery = await db("delivery_service")
        .select("id", "name", "created_at", "updated_at")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "delivery succesfully retrieved",
        delivery,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getdetail(req, res, next){
    try {
      const { id } = req.params;

      const delivery = await db("delivery_service")
        .select("id", "name", "store_id", "created_at", "updated_at")
        .where({id})
        .first();

      if (!delivery) {
        throw new Api404Error(`delivery with id ${id} not found`);
      };

      return res.json({
        success: true,
        message: "delivery succesfully retrieved",
        delivery
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next){
    try {
      const { id } = req.params;
      
      const delivery = await db("delivery_service").where({id}).first();
      if (!delivery) {
        throw new Api404Error(`delivery with id ${id} not found`);
      }
      
      const { error, value} = deliveryschema.validate(req.body);
      if (error) {
        throw new Api422Error("validation error", error.details);
      }

      const {name} = value;

      await db("delivery_service")
        .update({
          name
        })
        .where({id});

      return res.status(200).json({
        success: true,
        message: "delivery succesfully update"
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next){
    try {
      const { id } = req.params;
      const delivery = await db("delivery_service").where({id}).first();
      if (!delivery) {
        throw new Api404Error(`delivery with id ${id} not found`)
      }

      await db("delivery_service").del().where({id});

      return res.status(200).json({
        success: true,
        message: "delivery succesfully delete"
      })
      
    } catch (error) {
      next(error)
    }
  }
};
