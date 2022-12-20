const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

module.exports = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(path.join(__dirname, "../../public/users"))) {
        fs.mkdirSync(path.join(__dirname, "../../public/users"));
      }
      if (!fs.existsSync(path.join(__dirname, "../../public/stores"))) {
        fs.mkdirSync(path.join(__dirname, "../../public/stores"));
      }
      if (!fs.existsSync(path.join(__dirname, "../../public/product_images"))) {
        fs.mkdirSync(path.join(__dirname, "../../public/product_images"));
      }

      if (destination == "user") {
        cb(null, path.join(__dirname, "../../public/users"));
      } else if (destination == "store") {
        cb(null, path.join(__dirname, "../../public/stores"));
      } else if (destination == "product_image") {
        cb(null, path.join(__dirname, "../../public/product_images"));
      }
      //cb -> adalah sebuah callback
    },
    filename: (req, file, cb) => {
      cb(null, Date.now().toString().concat(".", file.mimetype.split("/")[1]));
    },
  });

  //config limit and filter by extention
  const upload = multer({
    storage,
    limits: {
      fieldSize: "1MB",
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb("file is not supported", false);
      }
    },
  });

  return upload;
};
