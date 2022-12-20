const db = require("../../databases");
const createProductShema = require("../validation/product.schema");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const upload = require("../helpers/multer")("product_image").array("image");
const satu = require("../helpers/multer")("product_image").single("image");

const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");

module.exports = class productsController {
    // static async create(req, res, next) {
    //     upload(req, res, async function(err) {
    //         try {
    //             if (err instanceof multer.MulterError) {
    //                 throw new Api400Error(err.message);
    //             } else if (err) {
    //                 throw new Api400Error(err);
    //             }

    //             const { name, price, stock, description, sold_total } = req.body;

    //             const uuid = crypto.randomUUID();
    //             const user = await db("users").where({ id: req.user.id }).first();
    //             await db("products")
    //                 .insert({ id: uuid, store_id: user.store_id, name, price: +price, stock: +stock, description, sold_total: +sold_total })
    //                 .catch((err) => {
    //                     return res.status(400).json({
    //                         success: false,
    //                         message: err,
    //                     });
    //                 });

    //             await db("product_images").insert(
    //                 req.files.map(function(d) {
    //                     const pathImages = d.path.split("\\");
    //                     const url = pathImages.splice(pathImages.length - 2).join("/");

    //                     return {
    //                         id: crypto.randomUUID(),
    //                         product_id: uuid,
    //                         image: url,
    //                     };
    //                 })
    //             );

    //             return res.status(201).json({
    //                 success: true,
    //                 message: "Product successfully added",
    //             });
    //         } catch (error) {
    //             next(error);
    //         }
    //     });
    // }

    static async create(req, res, next) {
        upload(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {
                    throw new Api400Error(err.message);
                } else if (err) {
                    throw new Api400Error(err);
                }

                //get data from body
                const { error, value } = createProductShema.validate(req.body);
                if (error) {
                    throw new Api422Error("Validate Error", error.details);
                }

                const { name, price, stock, description, sold_total } = value;
                const uuid = crypto.randomUUID();
                const user = await db("users").where({ id: req.user.id }).first();
                await db.transaction(async function(trx) {
                    //insert store
                    await db("products")
                        .transacting(trx)
                        .insert({
                            id: uuid,
                            store_id: user.store_id,
                            name,
                            price: +price,
                            stock: +stock,
                            description,
                            sold_total: +sold_total,
                        })
                        .catch(trx.rollback);

                    req.files.map(async function(d) {
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
                    message: "Product successfully added",
                });
            } catch (error) {
                next(error);
            }
        });
    }

    static async getAll(req, res, next) {
        try {
            //get data qury params for paginations, query params ?
            const { page = 1, limit = 25, search = "", order = "asc" } = req.query;

            const products = await db("products AS p")
                .leftJoin("product_images AS pi", "pi.product_id", "p.id")
                .select("p.id", "p.name", "p.stock", "p.price", "p.description", "pi.image")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .orderBy("p.created_at", order)
                .where("p.name", "like", `%${search}%`)
                .groupBy("p.id");

            return res.json({
                success: true,
                message: "data successfully retrieved",
                products,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            //get data from body
            const { error, value } = createProductShema.validate(req.body);
            if (error) {
                throw new Api422Error("Validate Error", error.details);
            }

            const { id } = req.params;
            const product = await db("products").where({ id }).first();
            if (!product) {
                throw new Api404Error("Product is not found");
            }

            const { name, price, stock, description, sold_total } = req.body;

            await db.transaction(async function(trx) {
                //update data note
                await db("products").where({ id }).transacting(trx).update({ name, price, stock, description, sold_total }).catch(trx.rollback);

                trx.commit;
            });
            return res.json({
                success: true,
                message: "product successfully update",
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const product = await db("products").where({ id }).first();

            if (!product) {
                throw new Api404Error(`product with ${id} not found`);
            }

            await db("products").del().where({ id });

            return res.json({
                success: true,
                message: "product successfully delete",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDetail(req, res, next) {
        try {
            const id = req.params.id;
            const products = await db("products AS p")
                .leftJoin("product_images AS pi", "pi.product_id", "p.id")
                .select("p.id AS pid", "p.name AS pn", "p.stock AS ps", "p.price AS pp", "p.description AS pd", "pi.id AS piid", "pi.image AS pii", "pi.created_at AS pic", "pi.updated_at AS piu", "p.created_at AS pc", "p.updated_at AS pu")
                .where({ "p.id": id });

            return res.json({
                success: true,
                message: "data product successfully retrieved",
                Products: products.map((d) => {
                    return {
                        id: d.pid,
                        name: d.pn,
                        description: d.ps,
                        price: d.pp,
                        stock: d.pd,
                        Images: products.map((e) => {
                            return {
                                id: e.piid,
                                url: req.get("host").concat("/", e.pii),
                                created_at: e.pic,
                                updated_at: e.piu,
                            };
                        }),
                        created_at: d.pc,
                        updated_at: d.pu,
                    };
                })[0],
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateImage(req, res, next) {
        satu(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {
                    throw new Api400Error(err.message);
                } else if (err) {
                    throw new Api400Error(err);
                }
                //retrive url or split path
                const id = req.params.id;
                const pathImage = req.file.path.split("\\");
                const url = pathImage.splice(pathImage.length - 2).join("/");
                // return res.json(url);

                const product_images = await db("product_images").where({ id }).first();
                if (product_images.image == null || product_images.image == "") {
                    await db("product_images")
                        .where({ id })
                        .update({
                            image: url,
                        })
                        .catch((error) => {
                            throw new Api400Error(error.message);
                        });
                    return res.json({
                        success: true,
                        message: "image successfully changed",
                        image: req.get("host").concat("/", url),
                    });
                } else if (product_images.image !== null || product_images.image !== "") {
                    fs.unlinkSync(path.join(__dirname, "../../public/".concat(product_images.image)));
                    await db("product_images")
                        .where({ id })
                        .update({
                            image: url,
                        })
                        .catch((error) => {
                            throw new Api400Error(error.message);
                        });
                    return res.json({
                        success: true,
                        message: "Image successfully changed",
                        image: req.get("host").concat("/", url),
                    });
                }
            } catch (error) {
                next(error);
            }
        });
    }
};