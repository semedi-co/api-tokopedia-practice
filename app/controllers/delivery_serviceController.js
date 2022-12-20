const db = require("../../databases");
const createStoreFront = require("../validation/delivery_service.schema");
// const crypto = require("crypto");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const upload = require("../helpers/multer")("store").single("avatar");

const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");

module.exports = class delivery_serviceController {
    static async create(req, res, next) {
        try {
            //get data from body
            const { error, value } = createStoreFront.validate(req.body);
            if (error) {
                throw new Api422Error("Validate Error", error.details);
            }
            const user = await db("users").where({ id: req.user.id }).first();
            const { name } = value;
            await db.transaction(async function(trx) {
                //insert store
                await db("delivery_service").transacting(trx).insert({ store_id: user.store_id, name }).catch(trx.rollback);

                trx.commit;
            });

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

            const delivery_service = await db("delivery_service")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .orderBy("created_at", order)
                .where("name", "like", `%${search}%`);

            return res.json({
                success: true,
                message: "data successfully retrieved",
                delivery_service,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            //get data from body
            const { error, value } = createStoreFront.validate(req.body);
            if (error) {
                throw new Api422Error("Validate Error", error.details);
            }

            const { id } = req.params;
            const delivery_service = await db("delivery_service").where({ id }).first();
            if (!delivery_service) {
                throw new Api404Error("delivery service is not found");
            }

            const { name } = value;

            await db.transaction(async function(trx) {
                //update data note
                await db("delivery_service").where({ id }).transacting(trx).update({ name }).catch(trx.rollback);

                trx.commit;
            });
            return res.json({
                success: true,
                message: "delivery service successfully update",
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const delivery_service = await db("delivery_service").where({ id }).first();

            if (!delivery_service) {
                throw new Api404Error(`delivery service with ${id} not found`);
            }

            await db("delivery_service").del().where({ id });

            return res.json({
                success: true,
                message: "delivery service successfully delete",
            });
        } catch (error) {
            next(error);
        }
    }
};