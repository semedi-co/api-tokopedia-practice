const db = require("../../databases");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//error
const { Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");
// multer
const upload = require("../helpers/multer")("user").single("avatar");

module.exports = class UsersController {
  static async updateAvatar(req, res, next) {
    upload(req, res, async function (err) {
      try {
        if (err instanceof multer.MulterError) {
          throw new Api400Error(err.message);
        } else if (err) {
          throw new Api400Error(err);
        }
        //retrive url or split path
        const pathAvatar = req.file.path.split("\\");
        const url = pathAvatar.splice(pathAvatar.length - 2).join("/");
        // return res.json(url);

        const user = await db("users").where({ id: req.user.id }).first();
        // return console.log(user.avatar);
        if (user.avatar != null) {
          fs.unlinkSync(
            path.join(__dirname, "../../public/".concat(user.avatar))
          );
        }

        await db("users")
          .where({ id: req.user.id })
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

  static async updateData(req, res, next) {
    try {
      const id = req.user.id;
      const data = await db("users").where({ id }).first();

      const { name, email, password } = req.body;

      if (!data) {
        throw new Api404Error(`User with id ${id} not found`);
      } else {
        await db("users")
          .update({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
          })
          .where({ id });

        return res.status(200).json({
          success: true,
          message: "data user successfully updated",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const id = req.user.id;
      const user = await db("users").where({ id }).first();

      if (!user) {
        throw new Api404Error(`User with id ${id} not found`);
      }

      await db("users").where({ id }).del();

      return res.json({
        success: true,
        message: "data user successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const id = req.user.id;
      const users = await db("users AS u")
        .leftJoin("stores AS s", "s.id", "u.store_id")
        .select(
          "u.id AS ui",
          "u.name AS un",
          "u.store_id AS us",
          "u.email AS ue",
          "u.avatar AS ua",
          "s.id AS si",
          "s.name AS sn",
          "s.avatar AS sa",
          "s.address AS sd"
        )
        .where({ "u.id": id });
      return res.json({
        success: true,
        message: "data stores successfully retrieved",
        User: users.map((d) => {
          return {
            id: d.ui,
            store_id: d.us == null ? "Anda tidak punya toko" : d.us,
            name: d.un,
            email: d.ue,
            avatar: d.ua,
            Store: {
              id: d.si,
              name: d.sn,
              avatar: d.sa,
              address: d.sd,
            },
          };
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAvatar(req, res, next) {
    try {
      const user = await db("users").where({ id: req.user.id }).first();
      fs.unlinkSync(path.join(__dirname, "../../public/".concat(user.avatar)));

      await db("users")
        .where({ id: req.user.id })
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
